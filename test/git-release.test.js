import {processRelease} from '../app/git/git-release';
import * as path from 'path';
import {writeFileSync, existsSync, mkdirSync} from "fs";
import git from "simple-git";


it('test test', async () => {
    expect.assertions(1);
    const mockRepoDirectoryPath = PATH + "/mock_repos";
    const localRepoPath = mockRepoDirectoryPath + "/local";
    const remoteRepoPath = mockRepoDirectoryPath + "/remote";
    await initMockRepo(mockRepoDirectoryPath, localRepoPath, remoteRepoPath);
    expect(existsSync(localRepoPath + "/README.md")).toBe(true);
});


async function initMockRepo(mockRepoDirectoryPath, localRepoPath, remoteRepoPath) {
    if (!existsSync(mockRepoDirectoryPath)){
        mkdirSync(mockRepoDirectoryPath);
    }
    if (!existsSync(localRepoPath)){
        mkdirSync(localRepoPath);
    }
    if (!existsSync(remoteRepoPath)){
        mkdirSync(remoteRepoPath);
    }
    await createMockRemoteGitRepo(remoteRepoPath);
    await createMockLocalGitRepo(localRepoPath, remoteRepoPath);
}

async function createMockRemoteGitRepo(path) {
    return git(path).init();
}

async function createMockLocalGitRepo(path, upstreamPath) {
    const readmePath = path + "/README.md";
    const testFilePath = path + "/TEST.md";

    return git(path).init()
        .addRemote("origin", upstreamPath + "/.git")
        .exec(() => {
            writeFileSync(readmePath, "initial readme");
        }).add(readmePath)
        .commit("initial commit")
        .push(null, ()  => {console.log(1)})
        .checkoutLocalBranch(DEVELOP)
        .push()
        .checkoutLocalBranch(STAGING)
        .push()
        .checkoutLocalBranch(RELEASE)
        .exec(() => {
            console.log(1);
            writeFileSync(testFilePath, "test content");
        })
        .commit("test commit")
        .push();
}

const PATH = path.dirname(process.cwd());

const MASTER = "master";
const DEVELOP = "develop";
const RELEASE = "release";
const STAGING = "staging";

const REMOTE = "origin";
