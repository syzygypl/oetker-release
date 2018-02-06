import git from "simple-git/promise";
import {notifyError} from "./git-result-handling";

export async function getRepositoriesLatestTag(repositoriesDirectories) {
    const tags = await Promise.all(repositoriesDirectories.map(async (directory) => await getRepositoryLatestTag(directory)));
    return tags.reduce((a, b) => {
        return a > b ? a : b;
    });
}

export async function getRepositoryLatestTag(directory) {
    const repo = git(directory);
    repo.checkout("master", notifyError);
    repo.pull(notifyError);
    const tags = await repo.tags(notifyError);
    return tags.latest || "";
}