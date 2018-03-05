export const PROJECTS_DIRECTORY = "/Volumes/dev/Sites/oetker";

export const ORIGIN_REPOSITORY = "origin";
export const VERSION = 'v1.22.120';

export const MANUAL_MODE = true;

export const RELEASE_INFRASTRUCTURE = true;
export const RELEASE_CMS = true;
export const RELEASE_FRONTEND = true;
export const RELEASE_SYNCHRONIZER = true;
export const RELEASE_INTERFACE = true;




export const INFRASTRUCTURE_MASTER_BRANCH = 'feature/ubuntu16';
export const INFRASTRUCTURE_FEATURES_BRANCH = 'features';
export const INFRASTRUCTURE_STAGING_BRANCH = 'ubuntu16-qa';

// export const CMS_MASTER_BRANCH = 'test-release-script-master';
// export const CMS_FEATURE_BRANCH = 'test-release-script-release';
// export const CMS_DEVELOP_BRANCH = 'test-release-script-develop';
// export const CMS_STAGING_BRANCH = 'test-release-script-staging';
// export const CMS_FRONTEND_DIRECTORY = "./htdocs/fileadmin/default/templates";
// export const FRONTEND_BUILD_SCRIPT = './frontend_build.sh';
//
// export const FRONTEND_FEATURE_BRANCH = 'test-release-script-release';
// export const FRONTEND_MASTER_BRANCH = 'test-release-script-master';
// export const FRONTEND_DEVELOP_BRANCH = 'test-release-script-develop';
// export const FRONTEND_STAGING_BRANCH = 'test-release-script-staging';
// export const FRONTEND_VERSION_FILE_PATH = 'source/data/versions.json';
//
// export const INTERFACE_FEATURE_BRANCH = 'test-release-script-release';
// export const INTERFACE_MASTER_BRANCH = 'test-release-script-master';
// export const INTERFACE_DEVELOP_BRANCH = 'test-release-script-develop';
// export const INTERFACE_STAGING_BRANCH = 'test-release-script-staging';
//
// export const SYNCHRONIZER_FEATURE_BRANCH = 'test-release-script-release';
// export const SYNCHRONIZER_MASTER_BRANCH = 'test-release-script-master';
// export const SYNCHRONIZER_DEVELOP_BRANCH = 'test-release-script-develop';
// export const SYNCHRONIZER_STAGING_BRANCH = 'test-release-script-staging';


export const CMS_MASTER_BRANCH = 'master';
export const CMS_FEATURE_BRANCH = 'features';
export const CMS_DEVELOP_BRANCH = 'develop';
export const CMS_STAGING_BRANCH = 'staging2-qa';
export const CMS_FRONTEND_DIRECTORY = "./htdocs/fileadmin/default/templates";
export const FRONTEND_BUILD_SCRIPT = './frontend_build.sh';

export const FRONTEND_MASTER_BRANCH = 'master';
export const FRONTEND_FEATURE_BRANCH = 'features';
export const FRONTEND_DEVELOP_BRANCH = 'develop';
export const FRONTEND_STAGING_BRANCH = 'staging2-qa';
export const FRONTEND_VERSION_FILE_PATH = 'source/data/versions.json';

export const INTERFACE_FEATURE_BRANCH = 'features';
export const INTERFACE_MASTER_BRANCH = 'master';
export const INTERFACE_DEVELOP_BRANCH = 'develop';
export const INTERFACE_STAGING_BRANCH = 'qa';

export const SYNCHRONIZER_FEATURE_BRANCH = 'features';
export const SYNCHRONIZER_MASTER_BRANCH = 'master';
export const SYNCHRONIZER_DEVELOP_BRANCH = 'develop';
export const SYNCHRONIZER_STAGING_BRANCH = 'qa';


export function getInfrastructureDirectory() {
    return PROJECTS_DIRECTORY + "/" + "infrastructure.oetker.de";
}
export function getCmsDirectory() {
    return PROJECTS_DIRECTORY + "/" + "cms.oetker.de";
}
export function getFrontendDirectory() {
    return PROJECTS_DIRECTORY + "/" + "frontend.oetker.de";
}
export function getFrontendBuildDirectory() {
    return PROJECTS_DIRECTORY + "/" + "frontend.oetker.de" + "/" + "source";
}
export function getInterfaceDirectory() {
    return PROJECTS_DIRECTORY + "/" + "externalinterface.oetker.de";
}
export function getSynchronizerDirectory() {
    return PROJECTS_DIRECTORY + "/" + "synchronizer.oetker.de";
}
export function getFrontendVersionFilePath() {
    return getFrontendDirectory() + "/" + FRONTEND_VERSION_FILE_PATH;
}

export const COLOR_RED = "\x1b[31m";
export const COLOR_GREEN = "\x1b[32m";
export const COLOR_BLACK = "\x1b[30m";
export const UNDERSCORE = "\x1b[4m";
export const RESET = "\x1b[0m";