import {
    CMS_FRONTEND_DIRECTORY, CMS_MASTER_BRANCH, CMS_STAGING_BRANCH, FRONTEND_BUILD_SCRIPT, FRONTEND_MASTER_BRANCH,
    FRONTEND_STAGING_BRANCH, getFrontendBuildDirectory, getFrontendDirectory
} from "../../configuration";
import {createStepHandlingFunction} from "../../git/git-result-handling";
import {execSync} from "child_process";

export function createAfterReleaseTasksHandler(){
    const frontendBuildHandlerFunction = frontendBuildHandler(getFrontendDirectory(), FRONTEND_STAGING_BRANCH, getFrontendBuildDirectory());
    return frontendBuildSpecificTasksHandler(CMS_STAGING_BRANCH, frontendBuildHandlerFunction, CMS_FRONTEND_DIRECTORY);
}

export function createCmsSpecificTasksHandler() {
    const frontendBuildHandlerFunction = frontendBuildHandler(getFrontendDirectory(), FRONTEND_MASTER_BRANCH, getFrontendBuildDirectory());
    return frontendBuildSpecificTasksHandler(CMS_MASTER_BRANCH, frontendBuildHandlerFunction, CMS_FRONTEND_DIRECTORY);
}

export function frontendBuildSpecificTasksHandler(backendBranch, buildFrontend, frontendBuildDirectory){
    return async (repo) => {
        return await repo.checkout(backendBranch, createStepHandlingFunction("Checking out " + backendBranch))
            .stash(createStepHandlingFunction("Stashing"))
            .then(() => buildFrontend())
            .add(frontendBuildDirectory, createStepHandlingFunction("Adding " + frontendBuildDirectory))
            .commit("frontend build", createStepHandlingFunction("Committing Frontend Build"));
    }
}

export function frontendBuildHandler(frontendRepo, branch, frontendDirectory) {
    return () => {
        execSync('cd ' + frontendRepo + ' && ' + 'git checkout ' + branch);
        console.log("Building frontend");
        execSync(FRONTEND_BUILD_SCRIPT + ' ' + frontendDirectory + ' ' + branch, {'stdio': 'inherit'});
        console.log("Frontend built");
        console.log("\n");
    }
}