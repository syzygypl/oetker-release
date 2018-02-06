import {existsSync, mkdirSync} from "fs";
import {deleteRepos, createMockGitRepos, generateGitDirectoryPath} from "./git-release-mock";
import git from "simple-git";
import {processRelease} from "../../app/git/git-release";
import {
    DEFAULT_MOCK_LOCAL_REPO_PATH, DEFAULT_MOCK_REMOTE_REPO_PATH,
    getMockBranchConfig,
    MOCK_DEVELOP, MOCK_MASTER, MOCK_RELEASE, MOCK_REMOTE, MOCK_REPO_DIRECTORY_PATH,
    MOCK_STAGING,
    MOCK_VERSION
} from "./git-mock-configuration";
import {createStepHandlingFunction} from "../../app/git/git-result-handling";

it('creates mock repositories', async () => {
    expect.assertions(2);

    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();

    await processMockRelease(localRepoPath, remoteRepoPath);

    expect(existsSync(localRepoPath + "/README.md")).toBe(true);
    expect(existsSync(remoteRepoPath + "/README.md")).toBe(true);

    clean(localRepoPath, remoteRepoPath);
});

it('merges master/develop/staging branches', async () => {

    expect.assertions(3);

    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();

    await processMockRelease(localRepoPath, remoteRepoPath);

    const localRepo = git(localRepoPath);

    await localRepo.checkout(MOCK_MASTER);
    await localRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch 'release/${MOCK_VERSION}'`)).toBe(true);
    });

    await localRepo.checkout(MOCK_DEVELOP);
    await localRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch '${MOCK_MASTER}' into ${MOCK_DEVELOP}`)).toBe(true);
    });

    await localRepo.checkout(MOCK_STAGING);
    await localRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch '${MOCK_DEVELOP}' into ${MOCK_STAGING}`)).toBe(true);
    });

    clean(localRepoPath, remoteRepoPath);
});

it('merges branch even if it has nothing to merge', async () => {
    expect.assertions(1);

    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();

    await createMockGitRepos(localRepoPath, remoteRepoPath, getMockBranchConfig(), MOCK_REMOTE);
    const localRepo = git(localRepoPath);

    localRepo.reset(["--hard", "HEAD~1"]);
    await localRepo.checkout(MOCK_MASTER);

    await processRelease(localRepoPath, getMockBranchConfig(), MOCK_VERSION);

    expect(true).toBe(true);

    clean(localRepoPath, remoteRepoPath);
});


it('pushes master/develop/staging branches after merge', async () => {
    expect.assertions(3);

    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();

    await processMockRelease(localRepoPath, remoteRepoPath);

    const remoteRepo = git(remoteRepoPath);

    await remoteRepo.checkout(MOCK_MASTER);
    await remoteRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch 'release/${MOCK_VERSION}'`)).toBe(true);
    });

    await remoteRepo.checkout(MOCK_DEVELOP);
    await remoteRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch '${MOCK_MASTER}' into ${MOCK_DEVELOP}`)).toBe(true);
    });

    await remoteRepo.checkout(MOCK_STAGING);
    await remoteRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch '${MOCK_DEVELOP}' into ${MOCK_STAGING}`)).toBe(true);
    });

    clean(localRepoPath, remoteRepoPath);
});

it('pushes tag to master', async () => {
    expect.assertions(1);

    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();

    await processMockRelease(localRepoPath, remoteRepoPath);

    const remoteRepo = git(remoteRepoPath);

    await remoteRepo.tags((err, result) => {
        expect(result.latest).toBe(MOCK_VERSION);
    });

    clean(localRepoPath, remoteRepoPath);
});

async function processMockRelease(localRepoPath, remoteRepoPath) {
    await createMockGitRepos(localRepoPath, remoteRepoPath, getMockBranchConfig(), MOCK_REMOTE);
    await processRelease(localRepoPath, getMockBranchConfig(), MOCK_VERSION);
}

function clean(localRepoPath, remoteRepoPath) {
    deleteRepos(localRepoPath, remoteRepoPath);
}


