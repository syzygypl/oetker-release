import {
    getInterfaceDirectory, INTERFACE_DEVELOP_BRANCH, INTERFACE_FEATURE_BRANCH, INTERFACE_MASTER_BRANCH,
    INTERFACE_STAGING_BRANCH, RELEASE_INTERFACE, VERSION
} from "../configuration";
import {processRelease} from "../git/git-release";
import {lineBreak, logHeader, logImportant} from "../ui/output-formatting";

export default async function releaseInterface(isReleasing, version) {
    logHeader("INTERFACE RELEASE");
    lineBreak();
    logHeader("Releasing interface: " + (isReleasing ? "YES": "NO"));
    lineBreak();
    if (isReleasing) {
        return await processRelease(getInterfaceDirectory(), branchConfig, version, interfaceSpecificTasks);
    }
}

function interfaceSpecificTasks(repo) {
}

const branchConfig = {
    features: INTERFACE_FEATURE_BRANCH,
    develop: INTERFACE_DEVELOP_BRANCH,
    master: INTERFACE_MASTER_BRANCH,
    staging: INTERFACE_STAGING_BRANCH,
};
