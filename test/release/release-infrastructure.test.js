import {createMockGitRepos, generateGitDirectoryPath} from "../git/mock/git-release-mock";
import {
    getMockBranchConfig, MOCK_MASTER, MOCK_RELEASE, MOCK_REMOTE,
    MOCK_STAGING,
} from "../git/mock/git-mock-configuration";
import {handleGitOperations} from "../../app/release/release-infrastructure";
import git from "simple-git";

test("merges features branch to master and master branch to staging", async () => {
    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();
    const branchesConfig = getMockBranchConfig();

    await createMockGitRepos(localRepoPath, remoteRepoPath, branchesConfig, MOCK_REMOTE);
    await handleGitOperations(branchesConfig, localRepoPath);

    const localRepo = git(localRepoPath);

    await localRepo.checkout(MOCK_MASTER);
    await localRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch '${MOCK_RELEASE}'`)).toBe(true);
    });

    await localRepo.checkout(MOCK_STAGING);
    await localRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch '${MOCK_MASTER}' into ${MOCK_STAGING}`)).toBe(true);
    });
});

test("pushes merged branches to origin", async () => {
    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();
    const branchesConfig = getMockBranchConfig();

    await createMockGitRepos(localRepoPath, remoteRepoPath, branchesConfig, MOCK_REMOTE);
    await handleGitOperations(branchesConfig, localRepoPath);

    const remoteRepo = git(remoteRepoPath);

    await remoteRepo.checkout(MOCK_MASTER);
    await remoteRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch '${MOCK_RELEASE}'`)).toBe(true);
    });

    await remoteRepo.checkout(MOCK_STAGING);
    await remoteRepo.log((err, result) => {
        expect(result.latest.message.startsWith(`Merge branch '${MOCK_MASTER}' into ${MOCK_STAGING}`)).toBe(true);
    });
});