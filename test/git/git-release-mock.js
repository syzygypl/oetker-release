import git from "simple-git";
import {existsSync, writeFileSync} from "fs";
import * as rimraf from "rimraf";
import * as mkdirp from "mkdirp";

export async function initMockGitRepos(localRepoPath, remoteRepoPath, branchConfig, remote) {
    createDirectories(localRepoPath, remoteRepoPath);
    const remoteRepo = await createMockRemoteGitRepo(remoteRepoPath);
    const localRepo = await createMockLocalGitRepo(localRepoPath, remoteRepoPath, branchConfig, remote);
    return {remoteRepo, localRepo};
}

export function deleteRepos(localRepoPath, remoteRepoPath){
    rimraf.sync(localRepoPath);
    rimraf.sync(remoteRepoPath);
}

async function createMockRemoteGitRepo(path) {
    return git(path).init().addConfig("receive.denyCurrentBranch", "updateInstead");
}

async function createMockLocalGitRepo(path, upstreamPath, branchConfig, remote) {
    const readmePath = path + "/README.md";
    const testFilePath = path + "/TEST.md";

    const repo = git(path);
    return repo.init()
        .addRemote(remote, upstreamPath + "/.git")
        .exec(() => {
            writeFileSync(readmePath, "initial readme");
        })
        .add(readmePath)
        .commit("initial commit")
        .push(remote, branchConfig.master, {"-u": null})
        .checkoutLocalBranch(branchConfig.develop)
        .push(remote, branchConfig.develop, {"-u": null})
        .checkoutLocalBranch(branchConfig.staging)
        .push(remote, branchConfig.staging, {"-u": null})
        .checkoutLocalBranch(branchConfig.features)
        .exec(() => {
            writeFileSync(testFilePath, "test content");
        })
        .add(testFilePath)
        .commit("test commit");
}

function createDirectories(localRepoPath, remoteRepoPath) {
    if (existsSync(localRepoPath)) {
        rimraf.sync(localRepoPath);
    }
    mkdirp.sync(localRepoPath);

    if (existsSync(remoteRepoPath)) {
        rimraf.sync(remoteRepoPath);
    }
    mkdirp.sync(remoteRepoPath);
}





