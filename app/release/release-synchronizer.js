import {
    getSynchronizerDirectory, SYNCHRONIZER_DEVELOP_BRANCH, SYNCHRONIZER_FEATURE_BRANCH, SYNCHRONIZER_MASTER_BRANCH,
    SYNCHRONIZER_STAGING_BRANCH, VERSION
} from "../configuration";
import {processRelease} from "../git/git-release";
import {lineBreak, logHeader, logImportant} from "../log/output-formatting";

export default async function releaseSynchronizer(isReleasing) {
    logHeader("SYNCHRONIZER RELEASE");
    lineBreak();
    logHeader("Releasing synchronizer: " + ((isReleasing ? "YES": "NO")));
    lineBreak();
    if (isReleasing) {
        return await processRelease(getSynchronizerDirectory(), branchConfig, VERSION, synchronizerSpecificTasks);
    }
}

function synchronizerSpecificTasks(repo) {

}

const branchConfig = {
    features: SYNCHRONIZER_FEATURE_BRANCH,
    develop: SYNCHRONIZER_DEVELOP_BRANCH,
    master: SYNCHRONIZER_MASTER_BRANCH,
    staging: SYNCHRONIZER_STAGING_BRANCH,
};
