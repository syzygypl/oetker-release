import {ORIGIN_REPOSITORY} from "../configuration";
import git from "simple-git";
import {createStepHandlingFunction} from "./git-result-handling";
import {log} from "../ui/output-formatting";

export async function processRelease(directory, branchConfig, version, specificTasks) {
    specificTasks = specificTasks || function () {
    };
    const releaseBranchName = "release/" + version;
    const repo = git(directory);

    await checkoutDevelop(repo, branchConfig.develop);
    await createReleaseBranch(repo, releaseBranchName);
    await mergeFeatures(repo, releaseBranchName, branchConfig.features);
    await specificTasks(repo);
    await addTag(repo, version);
    await mergeReleaseToMaster(repo, releaseBranchName, branchConfig.master);
    await mergeMasterToDevelop(repo, branchConfig.master, branchConfig.develop);
    await clean(repo, releaseBranchName);
    await mergeDevelopToStaging(repo, branchConfig.develop, branchConfig.staging);
    return await repo.checkout(branchConfig.master, createStepHandlingFunction("Checkout " + branchConfig.master));
}

async function checkoutDevelop(repo, developBranchName) {
    return await repo.checkout(developBranchName, createStepHandlingFunction("Checkout " + developBranchName))
        .pull(createStepHandlingFunction("Pull " + developBranchName));
}

async function createReleaseBranch(repo, releaseBranchName) {
    return await repo.checkoutLocalBranch(releaseBranchName,
        createStepHandlingFunction("Create new local branch " + releaseBranchName + " from develop"))
        .status(createStepHandlingFunction("Status", (stepName, err, result) => {
            if (result.current !== releaseBranchName) {
                log("Wrong branch after checkout");
                process.exit(1);
            }
        }));
}

async function mergeFeatures(repo, releaseBranchName, featuresBranchName) {
    return await repo.mergeFromTo(releaseBranchName, featuresBranchName, ["--no-ff"],
        createStepHandlingFunction("Merging " + featuresBranchName + " to " + releaseBranchName));
}

async function addTag(repo, version) {
    return await repo.addTag(version, createStepHandlingFunction("Creating tag " + version))
        .push(ORIGIN_REPOSITORY, version, createStepHandlingFunction("Pushing tags to " + ORIGIN_REPOSITORY));
}

async function mergeReleaseToMaster(repo, releaseBranchName, masterBranchName) {
    return await repo.checkout(masterBranchName, createStepHandlingFunction("Checkouting " + masterBranchName))
        .pull(createStepHandlingFunction("Pull " + masterBranchName))
        .mergeFromTo(masterBranchName, releaseBranchName, ["--no-ff"],
            createStepHandlingFunction("Merging " + releaseBranchName + " to " + masterBranchName))
        .push(createStepHandlingFunction("Pushing"));
}

async function mergeMasterToDevelop(repo, masterBranchName, developBranchName) {
    return await repo.checkout(developBranchName, createStepHandlingFunction("Checkouting " + developBranchName))
        .pull(createStepHandlingFunction("Pull " + developBranchName))
        .mergeFromTo(developBranchName, masterBranchName, ["--no-ff"],
            createStepHandlingFunction("Merging " + masterBranchName + " to " + developBranchName))
        .push(createStepHandlingFunction("Pushing"));
}

async function clean(repo, releaseBranchName) {
    return await repo.deleteLocalBranch(releaseBranchName, createStepHandlingFunction("Deleting branch " + releaseBranchName));
}

async function mergeDevelopToStaging(repo, developBranchName, stagingBranchName) {
    return await repo.checkout(stagingBranchName, createStepHandlingFunction("Checkouting " + stagingBranchName))
        .pull(createStepHandlingFunction("Pull " + stagingBranchName))
        .mergeFromTo(stagingBranchName, developBranchName, ["--no-ff", "--strategy-option=theirs"],
            createStepHandlingFunction("Merging " + developBranchName + " to " + stagingBranchName))
        .push(createStepHandlingFunction("Pushing"));
}
