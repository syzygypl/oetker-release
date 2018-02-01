import {existsSync, mkdirSync} from "fs";
import {deleteRepos, initMockGitRepos} from "./git-release-mock";
import git from "simple-git";
import {processRelease} from "../../app/git/git-release";
import {
    getMockBranchConfig,
    MOCK_DEVELOP, MOCK_MASTER, MOCK_REMOTE, MOCK_REPO_DIRECTORY_PATH,
    MOCK_STAGING,
    MOCK_VERSION
} from "./git-mock-configuration";

it('creates mock repositories', async () => {
    expect.assertions(2);

    await processMockRelease();

    expect(existsSync(MOCK_LOCAL_REPO_PATH + "/README.md")).toBe(true);
    expect(existsSync(MOCK_REMOTE_REPO_PATH + "/README.md")).toBe(true);

    clean();
}, 1000);

it('merges master/develop/staging branches', async () => {
    expect.assertions(3);

    await processMockRelease();

    const localRepo = git(MOCK_LOCAL_REPO_PATH);

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

    clean();
}, 2000);


it('pushes master/develop/staging branches after merge', async () => {
    expect.assertions(3);

    await processMockRelease();

    const remoteRepo = git(MOCK_REMOTE_REPO_PATH);

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

    clean();
}, 2000);

it('pushes tag to master', async () => {
    expect.assertions(1);

    await processMockRelease();


    const remoteRepo = git(MOCK_REMOTE_REPO_PATH);

    await remoteRepo.tags((err, result) => {
        expect(result.latest).toBe(MOCK_VERSION);
    });

    clean();
}, 2000);

async function processMockRelease() {
    await initMockGitRepos(MOCK_LOCAL_REPO_PATH, MOCK_REMOTE_REPO_PATH, getMockBranchConfig(), MOCK_REMOTE);
    await processRelease(MOCK_LOCAL_REPO_PATH, getMockBranchConfig(), MOCK_VERSION);
}

function clean() {
    deleteRepos(MOCK_LOCAL_REPO_PATH, MOCK_REMOTE_REPO_PATH);
}


const MOCK_LOCAL_REPO_PATH = MOCK_REPO_DIRECTORY_PATH + "/local";
const MOCK_REMOTE_REPO_PATH = MOCK_REPO_DIRECTORY_PATH + "/remote";

