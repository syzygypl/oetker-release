import {FgGreen, getFrontendVersionFilePath, VERSION} from "../../configuration";
import {createStepHandlingFunction} from "../../git/git-result-handling";
import {writeFileSync} from "fs";
import {lineBreak, logImportant} from "../../ui/output-formatting";

export function createFrontendSpecificTaskHandler(versionFilePath, version, master){
    return (repo) => {
        return repo.stash(createStepHandlingFunction("Stashing"))
            .exec(() => bumpVersion(versionFilePath,version))
            .add(versionFilePath, createStepHandlingFunction("Adding " + versionFilePath))
            .commit("bump version", createStepHandlingFunction("Committing Version Bump"));
    }
}

function bumpVersion(versionFilePath, version) {
    logImportant("Bump version");
    const versionObject = {"base": version, "professional": version};
    writeFileSync(versionFilePath, JSON.stringify(versionObject, null, "\t"));
    lineBreak();
}

