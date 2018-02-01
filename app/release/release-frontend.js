import {
    FgGreen,
    FRONTEND_DEVELOP_BRANCH, FRONTEND_FEATURE_BRANCH, FRONTEND_MASTER_BRANCH, FRONTEND_STAGING_BRANCH,
    getFrontendDirectory, getFrontendVersionFilePath, VERSION
} from "../configuration";
import {processRelease} from "../git/git-release";
import {createStepHandlingFunction} from "../git/git-result-handling";
import {writeFileSync} from "fs";
import {lineBreak, logHeader} from "../log/output-formatting";

export default async function releaseFrontend(isReleasing) {
    logHeader("FRONTEND RELEASE");
    lineBreak();
    logHeader("Releasing frontend: " + (isReleasing ? "YES": "NO"));
    lineBreak();
    if (isReleasing) {
        return await processRelease(getFrontendDirectory(), branchConfig, VERSION, frontendSpecificTasks);
    }
}

function frontendSpecificTasks(repo) {
    repo.stash(createStepHandlingFunction("Stashing"))
        .exec(() => bumpVersion())
        .add(getFrontendVersionFilePath(), createStepHandlingFunction("Adding " + getFrontendVersionFilePath()))
        .commit("bump version", createStepHandlingFunction("Committing Version Bump"));
}

function bumpVersion() {
    console.log(FgGreen, "Bumping version");
    const versionObject = {"base": VERSION, "professional": VERSION};
    writeFileSync(getFrontendVersionFilePath(), JSON.stringify(versionObject, null, "\t"));
    console.log("\n");
}

const branchConfig = {
    features: FRONTEND_FEATURE_BRANCH,
    develop: FRONTEND_DEVELOP_BRANCH,
    master: FRONTEND_MASTER_BRANCH,
    staging: FRONTEND_STAGING_BRANCH,
};
