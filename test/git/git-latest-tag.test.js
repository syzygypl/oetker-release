import {getMockBranchConfig, MOCK_REMOTE, MOCK_REPO_DIRECTORY_PATH, MOCK_VERSION} from "./git-mock-configuration";
import {processRelease} from "../../app/git/git-release";
import {deleteRepos, initMockGitRepos} from "./git-release-mock";
import {getRepositoriesLatestTag, getRepositoryLatestTag} from "../../app/git/git-latest-tag";
import git from "simple-git";


it('chooses highest tag from single repository', async () => {
    expect.assertions(1);
    await createMockRepos();

    const localRepository1 = git(MOCK_LOCAL_REPO1_PATH);
    const localRepository2 = git(MOCK_LOCAL_REPO2_PATH);

    localRepository1.addTag(TAG1);
    localRepository1.addTag(TAG2);
    localRepository1.push();

    localRepository2.addTag(TAG2);
    localRepository2.addTag(TAG3);
    localRepository2.push();

    expect(await getRepositoryLatestTag(MOCK_LOCAL_REPO1_PATH)).toBe(TAG2);
});


it('chooses highest tag from many repositories', async () => {
    expect.assertions(1);
    await createMockRepos();

    const localRepository1 = git(MOCK_LOCAL_REPO1_PATH);
    const localRepository2 = git(MOCK_LOCAL_REPO2_PATH);

    localRepository1.addTag(TAG1);
    localRepository1.addTag(TAG2);
    localRepository1.push();

    localRepository2.addTag(TAG2);
    localRepository2.addTag(TAG3);
    localRepository2.push();

    expect(await getRepositoriesLatestTag([MOCK_LOCAL_REPO1_PATH, MOCK_LOCAL_REPO2_PATH])).toBe(TAG3);
});





const MOCK_LOCAL_REPO1_PATH = MOCK_REPO_DIRECTORY_PATH + "/local1";
const MOCK_REMOTE_REPO1_PATH = MOCK_REPO_DIRECTORY_PATH + "/remote1";

const MOCK_LOCAL_REPO2_PATH = MOCK_REPO_DIRECTORY_PATH + "/local2";
const MOCK_REMOTE_REPO2_PATH = MOCK_REPO_DIRECTORY_PATH + "/remote2";

const TAG1 = "v1.1.10";
const TAG2 = "v1.2.1";
const TAG3 = "v1.5.0";

async function createMockRepos() {
    await initMockGitRepos(MOCK_LOCAL_REPO1_PATH, MOCK_REMOTE_REPO1_PATH, getMockBranchConfig(), MOCK_REMOTE);
    await initMockGitRepos(MOCK_LOCAL_REPO2_PATH, MOCK_REMOTE_REPO2_PATH, getMockBranchConfig(), MOCK_REMOTE);
}

function cleanMockRepos() {
    deleteRepos(MOCK_LOCAL_REPO1_PATH, MOCK_REMOTE_REPO1_PATH);
    deleteRepos(MOCK_LOCAL_REPO2_PATH, MOCK_REMOTE_REPO2_PATH);
}
