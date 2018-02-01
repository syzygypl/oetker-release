import {getCmsDirectory, ORIGIN_REPOSITORY} from "../configuration";
import git from "simple-git";
import {createStepHandlingFunction} from "./git-result-handling";
import {log} from "../log/output-formatting";

export async function processRelease(directory, branchConfig, version, specificTasks) {
    specificTasks = specificTasks || function () {};
    const releaseBranchName = "release/" + version;
    const repo = git(directory);

    checkoutDevelop(repo, branchConfig.develop);
    createReleaseBranch(repo, releaseBranchName);
    mergeFeatures(repo, releaseBranchName, branchConfig.features);
    specificTasks(repo);
    addTag(repo, version);
    mergeReleaseToMaster(repo, releaseBranchName, branchConfig.master);
    mergeMasterToDevelop(repo, branchConfig.master, branchConfig.develop);
    clean(repo, releaseBranchName);
    return await mergeDevelopToStaging(repo, branchConfig.develop, branchConfig.staging);
}

function checkoutDevelop(repo, developBranchName) {
    return repo.checkout(developBranchName, createStepHandlingFunction("Checkout " + developBranchName))
        .pull(createStepHandlingFunction("Pull " + developBranchName));
}

function createReleaseBranch(repo, releaseBranchName) {
    return repo.checkoutLocalBranch(releaseBranchName,
        createStepHandlingFunction("Create new local branch " + releaseBranchName + " from develop"))
        .status(createStepHandlingFunction("Status", (stepName, err, result) => {
            if (result.current !== releaseBranchName) {
                log("Wrong branch after checkout");
                process.exit(1);
            }
        }));
}

function mergeFeatures(repo, releaseBranchName, featuresBranchName) {
    return repo.mergeFromTo(releaseBranchName, featuresBranchName, ["--no-ff"],
        createStepHandlingFunction("Merging " + featuresBranchName + " to " + releaseBranchName))
}

function addTag(repo, version) {
    return repo.addTag(version, createStepHandlingFunction("Creating tag " + version))
        .push(ORIGIN_REPOSITORY, version, createStepHandlingFunction("Pushing tags to " + ORIGIN_REPOSITORY))
}

function mergeReleaseToMaster(repo, releaseBranchName, masterBranchName) {
    return repo.checkout(masterBranchName, createStepHandlingFunction("Checkouting " + masterBranchName))
        .pull(createStepHandlingFunction("Pull " + masterBranchName))
        .mergeFromTo(masterBranchName, releaseBranchName, ["--no-ff"],
            createStepHandlingFunction("Merging " + releaseBranchName + " to " + masterBranchName))
        .push(createStepHandlingFunction("Pushing"));
}

function mergeMasterToDevelop(repo, masterBranchName, developBranchName) {
    return repo.checkout(developBranchName, createStepHandlingFunction("Checkouting " + developBranchName))
        .pull(createStepHandlingFunction("Pull " + developBranchName))
        .mergeFromTo(developBranchName, masterBranchName, ["--no-ff"],
            createStepHandlingFunction("Merging " + masterBranchName + " to " + developBranchName))
        .push(createStepHandlingFunction("Pushing"));
}

function clean(repo, releaseBranchName) {
    return repo.deleteLocalBranch(releaseBranchName, createStepHandlingFunction("Deleting branch " + releaseBranchName));
}

function mergeDevelopToStaging(repo, developBranchName, stagingBranchName) {
    return repo.checkout(stagingBranchName, createStepHandlingFunction("Checkouting " + stagingBranchName))
        .pull(createStepHandlingFunction("Pull " + stagingBranchName))
        .mergeFromTo(stagingBranchName, developBranchName, ["--no-ff"],
            createStepHandlingFunction("Merging " + developBranchName + " to " + stagingBranchName))
        .push(createStepHandlingFunction("Pushing"));
}
