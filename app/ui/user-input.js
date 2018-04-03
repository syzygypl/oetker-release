import * as readline from 'readline-sync';
import {getRepositoriesLatestTag} from "../git/git-latest-tag";
import {
    getCmsDirectory, getFrontendDirectory, getInterfaceDirectory, getSynchronizerDirectory, RELEASE_CMS,
    RELEASE_FRONTEND, RELEASE_INFRASTRUCTURE, RELEASE_INTERFACE, RELEASE_SYNCHRONIZER, VERSION
} from "../configuration";
import {lineBreak, log, logImportant} from "./output-formatting";
import {bumpFixVersion, bumpMinorVersion} from "../service/semantic-versioning-service";
import {printConfiguration} from "./user-output";


export async function gatherReleaseInfo() {
    const configuration = {};

    if(!checkInteractiveMode()){
        throw new Error("You have to confirm interactive mode");
    }

    configuration.releaseInfrastructure = readline.keyInYN('Release Infrastructure?');
    configuration.releaseSynchronizer = readline.keyInYN('Release Synchronizer?');
    configuration.releaseInterface = readline.keyInYN('Release Interface?');
    configuration.releaseFrontend = readline.keyInYN('Release Frontend?');
    configuration.releaseCms = readline.keyInYN('Release Cms?');

    configuration.version = await resolveTag();

    printConfiguration(configuration);
    waitForConfirmation();

    return configuration;
}


export async function resolveTag() {
    logImportant("Finding latest repositories tags");
    const latestTag = await getLatestTag();

    logImportant("Found latest tags: " + latestTag);
    lineBreak();

    const tagBumpType = readTagBumpType();
    log(tagBumpType);
    const nextTag = resolveNextTag(latestTag, tagBumpType);
    logImportant("Next tag: " + nextTag);
    lineBreak();

    return nextTag;
}

function waitForConfirmation(){
    logImportant("Waiting for confirmation");
    const confirmed = readline.keyInYN('Start?');
    if(!confirmed){
        throw new Error("No confirmation from user");
    }
}

function checkInteractiveMode() {
    try {
        return readline.keyInYN("Confirm that you are in interactive mode");
    } catch (e) {
        return false;
    }
}

async function getLatestTag() {
    return await getRepositoriesLatestTag([
        getSynchronizerDirectory(),
        getInterfaceDirectory(),
        getFrontendDirectory(),
        getCmsDirectory()
    ]);
}

function readTagBumpType() {
    return tagBumpTypes[readline.keyInSelect(tagBumpTypes, "Select bump type", {"cancel": false})];
}

function resolveNextTag(tag, tagBumpType) {
    if (tagBumpType === FIX) {
        return bumpFixVersion(tag);
    } else if (tagBumpType === MINOR) {
        return bumpMinorVersion(tag);
    }
}

const MINOR = "minor";
const FIX = "fix";

const tagBumpTypes = [FIX, MINOR];

const DEFAULT_CONFIGURATION = {
    releaseInfrastructure: RELEASE_INFRASTRUCTURE,
    releaseSynchronizer: RELEASE_SYNCHRONIZER,
    releaseInterface: RELEASE_INTERFACE,
    releaseFrontend: RELEASE_FRONTEND,
    releaseCms: RELEASE_CMS,
    version: VERSION
};
