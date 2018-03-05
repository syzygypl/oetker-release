import {getMockBranchConfig, MOCK_REMOTE, MOCK_REPO_DIRECTORY_PATH, MOCK_VERSION} from "./git-mock-configuration";
import {processRelease} from "../../app/git/git-release";
import {deleteRepos, createMockGitRepos, generateGitDirectoryPath} from "./git-release-mock";
import {getRepositoriesLatestTag, getRepositoryLatestTag} from "../../app/git/git-latest-tag";
import git from "simple-git";


it('chooses highest tag from single repository', async () => {
    console.log("chooses highest tag from single repository start");
    expect.assertions(1);


    const localRepoPath = generateGitDirectoryPath();
    const remoteRepoPath = generateGitDirectoryPath();

    await createMockGitRepos(localRepoPath, remoteRepoPath, getMockBranchConfig(), MOCK_REMOTE);

    const localRepository = git(localRepoPath);

    localRepository.addTag(TAG1);
    localRepository.addTag(TAG2);
    localRepository.push();

    expect(await getRepositoryLatestTag(localRepoPath)).toBe(TAG2);

    deleteRepos(localRepoPath, remoteRepoPath);
    console.log("chooses highest tag from single repository end");
});


it('chooses highest tag from many repositories', async () => {
    console.log("chooses highest tag from many repositories start");
    expect.assertions(1);

    const localRepoPath1 = generateGitDirectoryPath();
    const remoteRepoPath1 = generateGitDirectoryPath();

    const localRepoPath2 = generateGitDirectoryPath();
    const remoteRepoPath2 = generateGitDirectoryPath();

    await createMockRepos(localRepoPath1, remoteRepoPath1, localRepoPath2, remoteRepoPath2);

    const localRepository1 = git(localRepoPath1);
    const localRepository2 = git(localRepoPath2);

    localRepository1.addTag(TAG1);
    localRepository1.addTag(TAG2);
    localRepository1.push();

    localRepository2.addTag(TAG2);
    localRepository2.addTag(TAG3);
    localRepository2.push();

    expect(await getRepositoriesLatestTag([localRepoPath1, localRepoPath2])).toBe(TAG3);

    cleanMockRepos(localRepoPath1, remoteRepoPath1, localRepoPath2, remoteRepoPath2);
    console.log("chooses highest tag from many repositories ");
});

const TAG1 = "v1.1.10";
const TAG2 = "v1.2.1";
const TAG3 = "v1.5.0";

async function createMockRepos(localRepoPath1, remoteRepoPath1, localRepoPath2, remoteRepoPath2) {
    await createMockGitRepos(localRepoPath1, remoteRepoPath1, getMockBranchConfig(), MOCK_REMOTE);
    await createMockGitRepos(localRepoPath2, remoteRepoPath2, getMockBranchConfig(), MOCK_REMOTE);
}

function cleanMockRepos(localRepoPath1, remoteRepoPath1, localRepoPath2, remoteRepoPath2) {
    deleteRepos(localRepoPath1, remoteRepoPath1);
    deleteRepos(localRepoPath2, remoteRepoPath2);
}
