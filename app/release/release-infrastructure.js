import git from 'simple-git';
import {
    getInfrastructureDirectory, INFRASTRUCTURE_FEATURES_BRANCH, INFRASTRUCTURE_MASTER_BRANCH,
    INFRASTRUCTURE_STAGING_BRANCH
} from "../configuration";
import {showStepInfoOrFail} from "../git/git-result-handling";
import {lineBreak, logHeader} from "../ui/output-formatting";


export default async function releaseInfrastructure(isReleasing) {
    logHeader("INFRASTRUCTURE RELEASE");
    lineBreak();
    logHeader("Releasing infrastructure: " + (isReleasing ? "YES" : "NO"));
    lineBreak();
    if (isReleasing) {
        return await handleGitOperations(branchConfig, getInfrastructureDirectory());
    }
}

export function handleGitOperations(branchConfig, directory) {
    const infrastructure = git(directory);
    return infrastructure
        .checkout(branchConfig.master, (err, result) => {
            showStepInfoOrFail("Checkout " + branchConfig.master, err, result)
        })
        .pull((err, result) => {
            showStepInfoOrFail("Pull " + branchConfig.master, err, result)
        })
        .mergeFromTo(branchConfig.master, branchConfig.features, ["--no-ff"], (err, result) => {
            showStepInfoOrFail("Merging " + branchConfig.features, err, result)
        })
        .push((err, result) => {
            showStepInfoOrFail("Push", err, result)
        })
        .checkout(branchConfig.staging, (err, result) => {
            showStepInfoOrFail("Checkout " + branchConfig.staging, err, result)
        })
        .pull((err, result) => {
            showStepInfoOrFail("Pull " + branchConfig.staging, err, result)
        })
        .mergeFromTo(branchConfig.staging, branchConfig.master, ["--no-ff"], (err, result) => {
            showStepInfoOrFail("Merging " + branchConfig.master, err, result)
        })
        .push((err, result) => {
            showStepInfoOrFail("Push", err, result)
        });
}

const branchConfig = {
    features: INFRASTRUCTURE_FEATURES_BRANCH,
    develop: INFRASTRUCTURE_MASTER_BRANCH,
    master: INFRASTRUCTURE_MASTER_BRANCH,
    staging: INFRASTRUCTURE_STAGING_BRANCH,
};