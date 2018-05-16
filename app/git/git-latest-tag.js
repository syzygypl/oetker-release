import git from "simple-git/promise";
import {getCmsDirectory, getFrontendDirectory, getInterfaceDirectory, getSynchronizerDirectory} from "../configuration";
import {logError} from "../log/output-formatting";


export async function getLatestTag() {
    return await getRepositoriesLatestTag([
        getSynchronizerDirectory(),
        getInterfaceDirectory(),
        getFrontendDirectory(),
        getCmsDirectory()
    ]);
}

export async function getRepositoriesLatestTag(repositoriesDirectories) {
    const tags = await Promise.all(repositoriesDirectories.map(async (directory) => await getRepositoryLatestTag(directory)));
    return tags.reduce((a, b) => {
        return a > b ? a : b;
    });
}

export async function getRepositoryLatestTag(directory) {
    const repo = git(directory);
    let tags = {};
    try{
        await repo.checkout("master");
        await repo.pull();
        tags = await repo.tags();
    }catch (e){
        logError("Failed to fetch tags in directory " + directory + ": " + e);
        throw e;
    }
    return tags.latest || "";
}
