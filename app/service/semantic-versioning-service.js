export function bumpFixVersion(versionString) {
    const version = getVersionFromString(versionString);
    version.fix++;
    return constructVersionString(version);
}

export function bumpMinorVersion(versionString) {
    const version = getVersionFromString(versionString);
    version.minor++;
    version.fix = 0;
    return constructVersionString(version);
}

function getVersionFromString(versionString) {
    const match = VERSION_REGEX.exec(versionString);
    if(!match){
        throw Error("Error when parsing string: " + versionString);
    }
    return {
        "major": match[1],
        "minor": match[2],
        "fix": match[3],
    };
}

function constructVersionString(versionObject) {
    return interpolateVersionString(versionObject.major, versionObject.minor, versionObject.fix);
}

function interpolateVersionString(major, minor, fix){
    return `v${major}.${minor}.${fix}`;
}

const VERSION_REGEX = /v(\d+)\.(\d+)\.(\d+)/;
