import {readFileSync, writeFileSync} from "fs";
import {createMockGitRepos, generateGitDirectoryPath} from "../git/mock/git-release-mock";
import {
    getMockBranchConfig, MOCK_MASTER, MOCK_REMOTE, MOCK_STAGING,
    MOCK_VERSION
} from "../git/mock/git-mock-configuration";
import {processCmsRelease} from "../../app/release/release-cms";
import git from "simple-git";
import {logImportant} from "../../app/log/output-formatting";
import {execSync} from "child_process";
import {frontendBuildSpecificTasksHandler} from "../../app/release/specific-tasks/cms-specific-tasks";

test("frontend release specific tasks", async () => {
    expect.assertions(1);

    const localBackendRepoPath = generateGitDirectoryPath();
    const remoteBackendRepoPath = generateGitDirectoryPath();
    const localFrontendRepoPath = generateGitDirectoryPath();
    const remoteFrontendRepoPath = generateGitDirectoryPath();

    await createMockGitRepos(localBackendRepoPath, remoteBackendRepoPath, getMockBranchConfig(), MOCK_REMOTE);
    await createMockGitRepos(localFrontendRepoPath, remoteFrontendRepoPath, getMockBranchConfig(), MOCK_REMOTE);

    const specificTasksHandler = frontendMockBuildHandler(localFrontendRepoPath, localBackendRepoPath, MOCK_MASTER);

    await processCmsRelease(localBackendRepoPath, getMockBranchConfig(), MOCK_VERSION, specificTasksHandler, null);

    const localBackendRepo = git(localBackendRepoPath);
    const buildFilePath = localBackendRepoPath + "/" + BUILD_FILE;

    await localBackendRepo.checkout(MOCK_MASTER);
    expect(readFileSync(buildFilePath).toString()).toBe(MOCK_MASTER);

});


test("frontend after release specific tasks", async () => {
    expect.assertions(1);

    const localBackendRepoPath = generateGitDirectoryPath();
    const remoteBackendRepoPath = generateGitDirectoryPath();
    const localFrontendRepoPath = generateGitDirectoryPath();
    const remoteFrontendRepoPath = generateGitDirectoryPath();

    await createMockGitRepos(localBackendRepoPath, remoteBackendRepoPath, getMockBranchConfig(), MOCK_REMOTE);
    await createMockGitRepos(localFrontendRepoPath, remoteFrontendRepoPath, getMockBranchConfig(), MOCK_REMOTE);

    const afterReleaseTasksHandler = frontendMockBuildHandler(localFrontendRepoPath, localBackendRepoPath, MOCK_STAGING);

    await processCmsRelease(localBackendRepoPath, getMockBranchConfig(), MOCK_VERSION, null, afterReleaseTasksHandler);

    const localBackendRepo = git(localBackendRepoPath);
    const buildFilePath = localBackendRepoPath + "/" + BUILD_FILE;

    await localBackendRepo.checkout(MOCK_STAGING);
    expect(readFileSync(buildFilePath).toString()).toBe(MOCK_STAGING);

});


function frontendMockBuildHandler(frontendDirectory, backendDirectory, branch) {
    const frontendBuildHandlerFunction = frontendBuildHandler(frontendDirectory, branch, backendDirectory);
    return frontendBuildSpecificTasksHandler(branch, frontendBuildHandlerFunction, backendDirectory)
}

function frontendBuildHandler(frontendDirectory, branch, frontendBuildDirectory) {
    return () => {
        logImportant("Mock frontend building");
        execSync('cd ' + frontendDirectory + ' && ' + 'git checkout ' + branch);
        logImportant("Writing to " + frontendBuildDirectory + "/" + BUILD_FILE + " content:" + branch);
        writeFileSync(frontendBuildDirectory + "/" + BUILD_FILE, branch);
    }
}

const BUILD_FILE = "build_file.txt";


