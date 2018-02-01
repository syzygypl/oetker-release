import * as readline from 'readline-sync';

export function gatherReleaseInfo() {
    const configuration = {};

    configuration.releaseInfrastructure = readline.keyInYN('Release Infrastructure?');
    configuration.releaseSynchronizer = readline.keyInYN('Release Synchronizer?');
    configuration.releaseInterface = readline.keyInYN('Release Interface?');
    configuration.releaseFrontend = readline.keyInYN('Release Frontend?');
    configuration.releaseCms = readline.keyInYN('Release Cms?');

    return configuration;
}

export function checkInteractiveMode() {
    try {
        return readline.keyInYN("Check Interactive mode");
    } catch (e) {
        return false;
    }

}