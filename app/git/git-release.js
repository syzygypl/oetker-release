import {getCmsDirectory, ORIGIN_REPOSITORY} from "../configuration";
import git from "simple-git";
import {createStepHandlingFunction} from "./git-result-handling";

export async function processRelease(directory, branchConfig, version, specificTasks) {
    const releaseBranchName = "release/" + version;
    const repo = git(directory);

    checkoutDevelop(repo, branchConfig.develop);
    createReleaseBranch(repo, releaseBranchName);
    mergeFeatures(repo, releaseBranchName, branchConfig.features);
    specificTasks(repo);
    addTag(repo, version);
    mergeToMaster(repo, releaseBranchName, branchConfig.master);
    clean(repo, releaseBranchName);
    return await mergeToStaging(repo, branchConfig.master, branchConfig.staging);
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
                console.log("Wrong branch after checkout");
                process.exit(1);
            }
        }));
}

function mergeFeatures(repo, releaseBranchName, featuresBranchName) {
    return repo.mergeFromTo(releaseBranchName, featuresBranchName,
        createStepHandlingFunction("Merging " + featuresBranchName + " to " + releaseBranchName))
}

function mergeToMaster(repo, releaseBranchName, masterBranchName) {
    return repo.checkout(masterBranchName, createStepHandlingFunction("Checkouting " + masterBranchName))
        .pull(createStepHandlingFunction("Pull " + masterBranchName))
        .mergeFromTo(masterBranchName, releaseBranchName, {"--no-ff": null},
            createStepHandlingFunction("Merging " + releaseBranchName + " to " + masterBranchName))
        .push(createStepHandlingFunction("Pushing"));
}


function addTag(repo, version) {
    return repo.addTag(version, createStepHandlingFunction("Creating tag " + version))
        .push(ORIGIN_REPOSITORY, version, createStepHandlingFunction("Pushing tags to " + ORIGIN_REPOSITORY))
}

function clean(repo, releaseBranchName) {
    return repo.deleteLocalBranch(releaseBranchName, createStepHandlingFunction("Deleting branch " + releaseBranchName));
}

function mergeToStaging(repo, masterBranchName, stagingBranchName) {
    return repo.checkout(stagingBranchName, createStepHandlingFunction("Checkouting " + stagingBranchName))
        .pull(createStepHandlingFunction("Pull " + stagingBranchName))
        .mergeFromTo(stagingBranchName, masterBranchName, {"--no-ff": null},
            createStepHandlingFunction("Merging " + masterBranchName + " to " + stagingBranchName))
        .push(createStepHandlingFunction("Pushing"));
}
