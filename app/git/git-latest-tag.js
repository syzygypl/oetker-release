import git from "simple-git/promise";

export async function getRepositoriesLatestTag(repositoriesDirectories) {
    const tags = await Promise.all(repositoriesDirectories.map(async (directory) => await getRepositoryLatestTag(directory)));

    return tags.reduce((a, b) => {
        return a > b ? a : b;
    });
}

export async function getRepositoryLatestTag(directory) {
    const repo = git(directory);
    repo.checkout("master");
    repo.pull();
    const tags = await repo.tags();
    return tags.latest || "";
}