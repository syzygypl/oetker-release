import {
    CMS_DEVELOP_BRANCH, CMS_FEATURE_BRANCH, CMS_FRONTEND_DIRECTORY, CMS_MASTER_BRANCH, CMS_STAGING_BRANCH,
    FRONTEND_BUILD_SCRIPT, FRONTEND_MASTER_BRANCH, getCmsDirectory, getFrontendBuildDirectory, getFrontendDirectory,
    RELEASE_CMS, VERSION
} from "../configuration";
import {createStepHandlingFunction} from "../git/git-result-handling";
import {execSync} from "child_process";
import {processRelease} from "../git/git-release";
import {lineBreak, logHeader, logImportant} from "../ui/output-formatting";


export default async function releaseCms(isReleasing, version) {
    logHeader("CMS RELEASE");
    lineBreak();
    logHeader("Releasing CMS: " + (isReleasing ? "YES" : "NO"));
    lineBreak();

    const specificTaskHandler = createCmsSpecificTasksHandler(branchConfig.master, branchConfig.develop);

    if (isReleasing) {
        return await processRelease(getCmsDirectory(), branchConfig, version, specificTaskHandler);
    }
}

function createCmsSpecificTasksHandler(master, develop) {
    return (repo) => {
        repo.stash(createStepHandlingFunction("Stashing"))
            .exec(() => buildFrontend())
            .add(CMS_FRONTEND_DIRECTORY, createStepHandlingFunction("Adding " + CMS_FRONTEND_DIRECTORY))
            .commit("frontend build", createStepHandlingFunction("Committing Frontend Build"));
    }
}

function cmsSpecificTasks(repo) {

}

export function buildFrontend() {
    console.log("Building frontend");
    execSync(FRONTEND_BUILD_SCRIPT + ' ' + getFrontendBuildDirectory() + ' ' + FRONTEND_MASTER_BRANCH, {'stdio': 'inherit'});
    console.log("Frontend built");
    console.log("\n");
}

const branchConfig = {
    features: CMS_FEATURE_BRANCH,
    develop: CMS_DEVELOP_BRANCH,
    master: CMS_MASTER_BRANCH,
    staging: CMS_STAGING_BRANCH,
};


