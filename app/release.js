import releaseInfrastructure from './release/release-infrastructure';
import releaseSynchronizer from './release/release-synchronizer';
import releaseInterface from './release/release-interface';
import releaseFrontend from './release/release-frontend';
import releaseCms from './release/release-cms';
import {gatherReleaseInfo} from "./ui/user-input";
import {lineBreak} from "./ui/output-formatting";


export default async function release() {
    const configuration = await gatherReleaseInfo();
    lineBreak();

    await releaseInfrastructure(configuration.releaseInfrastructure);
    await releaseSynchronizer(configuration.releaseSynchronizer, configuration.version);
    await releaseInterface(configuration.releaseInterface, configuration.version);
    await releaseFrontend(configuration.releaseFrontend, configuration.version);
    await releaseCms(configuration.releaseCms, configuration.releaseFrontend, configuration.version);
}
