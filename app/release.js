import releaseInfrastructure from './release/release-infrastructure';
import releaseSynchronizer from './release/release-synchronizer';
import releaseInterface from './release/release-interface';
import releaseFrontend from './release/release-frontend';
import releaseCms from './release/release-cms';
import {
    MANUAL_MODE, RELEASE_CMS, RELEASE_FRONTEND, RELEASE_INFRASTRUCTURE, RELEASE_INTERFACE,
    RELEASE_SYNCHRONIZER
} from "./configuration";
import {gatherReleaseInfo} from "./ui/user-input";
import {lineBreak, log} from "./ui/output-formatting";


export default async function release() {
    const configuration = await gatherReleaseInfo(MANUAL_MODE);
    lineBreak();

    lineBreak();

    await releaseInfrastructure(configuration.releaseInfrastructure);
    await releaseSynchronizer(configuration.releaseSynchronizer, configuration.version);
    await releaseInterface(configuration.releaseInterface, configuration.version);
    await releaseFrontend(configuration.releaseFrontend, configuration.version);
    await releaseCms(configuration.releaseCms, configuration.version);
}
