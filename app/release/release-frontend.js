import {
    FgGreen,
    FRONTEND_DEVELOP_BRANCH, FRONTEND_FEATURE_BRANCH, FRONTEND_MASTER_BRANCH, FRONTEND_STAGING_BRANCH,
    getFrontendDirectory, getFrontendVersionFilePath, VERSION
} from "../configuration";
import {processRelease} from "../git/git-release";
import {createStepHandlingFunction} from "../git/git-result-handling";
import {writeFileSync} from "fs";
import {lineBreak, logHeader} from "../ui/output-formatting";
import {createFrontendSpecificTaskHandler} from "./specific-tasks/frontend-specific-tasks";

export default async function releaseFrontend(isReleasing, version) {
    logHeader("FRONTEND RELEASE");
    lineBreak();
    logHeader("Releasing frontend: " + (isReleasing ? "YES": "NO"));
    lineBreak();

    const specificTasksHandler = createFrontendSpecificTaskHandler(getFrontendVersionFilePath(), version, branchConfig.master);

    if (isReleasing) {
        return await processRelease(getFrontendDirectory(), branchConfig, version, specificTasksHandler);
    }
}


const branchConfig = {
    features: FRONTEND_FEATURE_BRANCH,
    develop: FRONTEND_DEVELOP_BRANCH,
    master: FRONTEND_MASTER_BRANCH,
    staging: FRONTEND_STAGING_BRANCH,
};
