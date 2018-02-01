import releaseInfrastructure from './release/release-infrastructure';
import releaseSynchronizer from './release/release-synchronizer';
import releaseInterface from './release/release-interface';
import releaseFrontend from './release/release-frontend';
import releaseCms from './release/release-cms';
import {
    MANUAL_MODE, RELEASE_CMS, RELEASE_FRONTEND, RELEASE_INFRASTRUCTURE, RELEASE_INTERFACE,
    RELEASE_SYNCHRONIZER
} from "./configuration";
import {checkInteractiveMode, gatherReleaseInfo} from "./user-input/user-input";
import {lineBreak, log} from "./log/output-formatting";


export default async function release() {
    const manual = MANUAL_MODE && checkInteractiveMode();
    const configuration = manual ? gatherReleaseInfo() : defaultConfiguration;
    lineBreak();
    log("Configuration: " + JSON.stringify(configuration));
    lineBreak();

    await releaseInfrastructure(configuration.releaseInfrastructure);
    await releaseSynchronizer(configuration.releaseSynchronizer);
    await releaseInterface(configuration.releaseInterface);
    await releaseFrontend(configuration.releaseFrontend);
    await releaseCms(configuration.releaseCms);
}


const defaultConfiguration = {
    releaseInfrastructure: RELEASE_INFRASTRUCTURE,
    releaseSynchronizer: RELEASE_SYNCHRONIZER,
    releaseInterface: RELEASE_INTERFACE,
    releaseFrontend: RELEASE_FRONTEND,
    releaseCms: RELEASE_CMS
};