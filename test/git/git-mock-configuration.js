import PATH from "app-root-path";

export function getMockBranchConfig() {
    return {
        "master": MOCK_MASTER,
        "develop": MOCK_DEVELOP,
        "features": MOCK_RELEASE,
        "staging": MOCK_STAGING,
    }
}

export const MOCK_REPO_DIRECTORY_PATH = PATH + "/test-repositories";

export const MOCK_MASTER = "master";
export const MOCK_DEVELOP = "develop";
export const MOCK_RELEASE = "features";
export const MOCK_STAGING = "staging";

export const MOCK_REMOTE = "origin";
export const MOCK_VERSION = "v1.1.1";