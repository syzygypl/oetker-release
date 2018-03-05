import git from "simple-git";
import {existsSync, writeFileSync} from "fs";
import * as mkdirp from "mkdirp";
import {rmdirSyncRec} from "../../../app/service/file-system-service";
import {MOCK_REPO_DIRECTORY_PATH} from "./git-mock-configuration";
import uuid from "uuid/v4";

export async function createMockGitRepos(localRepoPath, remoteRepoPath, branchConfig, remote) {
    await createMockRemoteGitRepo(remoteRepoPath);
    await createMockLocalGitRepo(localRepoPath, remoteRepoPath, branchConfig, remote);
    return null;
}

export function deleteRepos(localRepoPath, remoteRepoPath) {
    deleteRepo(localRepoPath);
    deleteRepo(remoteRepoPath);
}

export function deleteRepo(path) {
    rmdirSyncRec(path);
}

export function generateGitDirectoryPath() {
    return MOCK_REPO_DIRECTORY_PATH + "/" + uuid();
}

async function createMockRemoteGitRepo(path) {
    createDirectory(path);

    return git(path).init().addConfig("receive.denyCurrentBranch", "updateInstead");
}


async function createMockLocalGitRepo(path, remotePath, branchConfig, remote) {
    createDirectory(path);
    const readmePath = path + "/README.md";
    const testFilePath = path + "/TEST.md";

    const repo = git(path);
    return repo.init()
        .addRemote(remote, remotePath + "/.git")
        .exec(() => {
            writeFileSync(readmePath, "initial readme");
        }).add(readmePath)
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

function createDirectory(path){
    if (existsSync(path)) {
        rmdirSyncRec(path);
    }
    mkdirp.sync(path);
}