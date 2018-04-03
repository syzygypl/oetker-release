import {
    CMS_DEVELOP_BRANCH, CMS_FEATURE_BRANCH, CMS_MASTER_BRANCH, CMS_STAGING_BRANCH,
    getCmsDirectory
} from "../configuration";
import {processRelease} from "../git/git-release";
import {lineBreak, logHeader} from "../ui/output-formatting";
import {createAfterReleaseTasksHandler, createCmsSpecificTasksHandler} from "./specific-tasks/cms-specific-tasks";


export default async function releaseCms(isReleasing, isFrontendReleasing, version) {
    logHeader("CMS RELEASE");
    lineBreak();
    logHeader("Releasing CMS: " + (isReleasing ? "YES" : "NO"));
    lineBreak();

    const specificTaskHandler = isFrontendReleasing ? createCmsSpecificTasksHandler() : null;
    const afterReleaseTasksHandler = isFrontendReleasing ? createAfterReleaseTasksHandler() : null;
    if (isReleasing) {
        return await processCmsRelease(getCmsDirectory(), branchConfig, version, specificTaskHandler, afterReleaseTasksHandler);
    }
}

export async function processCmsRelease(directory, branchConfig, version, specificTasksHandler, afterReleaseTasksHandler){
    await processRelease(directory, branchConfig, version, specificTasksHandler, afterReleaseTasksHandler);
}

const branchConfig = {
    features: CMS_FEATURE_BRANCH,
    develop: CMS_DEVELOP_BRANCH,
    master: CMS_MASTER_BRANCH,
    staging: CMS_STAGING_BRANCH,
};


