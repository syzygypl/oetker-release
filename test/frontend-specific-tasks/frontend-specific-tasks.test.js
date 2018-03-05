import {getMockBranchConfig, MOCK_REMOTE, MOCK_VERSION} from "../git/mock/git-mock-configuration";
import {createMockGitRepos, deleteRepos, generateGitDirectoryPath} from "../git/mock/git-release-mock";
import {createFrontendSpecificTaskHandler} from "../../app/release/specific-tasks/frontend-specific-tasks";
import git from "simple-git";
import {readFileSync} from "fs";


it('creates version file', async () => {
    expect.assertions(2);

    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();

    await initMockRepos(localRepoPath, remoteRepoPath);

    const versionFilePath = localRepoPath + "/version.json";
    const repo = git(localRepoPath);

    await createFrontendSpecificTaskHandler(versionFilePath, MOCK_VERSION)(repo);

    const versionObject = JSON.parse(readFileSync(versionFilePath));
    expect(versionObject.base).toBe(MOCK_VERSION);
    expect(versionObject.professional).toBe(MOCK_VERSION);

    clean(localRepoPath, remoteRepoPath);
});

async function initMockRepos(localRepoPath, remoteRepoPath) {
    await createMockGitRepos(localRepoPath, remoteRepoPath, getMockBranchConfig(), MOCK_REMOTE);
    return null;
}

function clean(localRepoPath, remoteRepoPath) {
    deleteRepos(localRepoPath, remoteRepoPath);
}
