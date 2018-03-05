import {lineBreak, logHeader, logImportant} from "./output-formatting";

export function printConfiguration(configuration) {
    logHeader("Configuration");
    lineBreak();

    logImportant("Release Infrastructure: " + configuration.releaseInfrastructure);
    logImportant("Release Synchronizer:   " + configuration.releaseSynchronizer);
    logImportant("Release Interface:      " + configuration.releaseInterface);
    logImportant("Release Frontend:       " + configuration.releaseFrontend);
    logImportant("Release Cms:            " + configuration.releaseCms);
    logImportant("Version:                " + configuration.version);
    lineBreak();
}