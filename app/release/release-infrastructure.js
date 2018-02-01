import git from 'simple-git';
import {
    getInfrastructureDirectory, INFRASTRUCTURE_MASTER_BRANCH, INFRASTRUCTURE_FEATURES_BRANCH,
    RELEASE_INFRASTRUCTURE
} from "../configuration";
import {showStepInfoOrFail} from "../git/git-result-handling";
import {lineBreak, logHeader, logImportant} from "../log/output-formatting";


export default async function releaseInfrastructure(isReleasing) {
    logHeader("INFRASTRUCTURE RELEASE");
    lineBreak();
    logHeader("Releasing infrastructure: " + (isReleasing ? "YES": "NO"));
    lineBreak();
    if(isReleasing) {
        return await handleGitOperations(INFRASTRUCTURE_FEATURES_BRANCH);
    }
}

function handleGitOperations(releaseBranch) {
    const infrastructure = git(getInfrastructureDirectory());
    return infrastructure
        .checkout(INFRASTRUCTURE_MASTER_BRANCH, (err, result) => {
            showStepInfoOrFail("Checkout " + INFRASTRUCTURE_MASTER_BRANCH, err, result)
        })
        .pull(
            (err, result) => {
                showStepInfoOrFail("Pull " + INFRASTRUCTURE_MASTER_BRANCH, err, result)
            })
        .mergeFromTo(INFRASTRUCTURE_MASTER_BRANCH, releaseBranch,
            (err, result) => {
                showStepInfoOrFail("Merging " + releaseBranch, err, result)
            })
        .push((err, result) => {showStepInfoOrFail("Push", err, result)});
}
