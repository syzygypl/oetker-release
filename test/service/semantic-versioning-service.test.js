import {bumpFixVersion, bumpMinorVersion} from "../../app/service/semantic-versioning-service";

it("must bump minor version", () => {
    expect(bumpMinorVersion(VERSION)).toBe(BUMPED_MINOR_VERSION);
});

it("must bump fix version", () => {
    expect(bumpFixVersion(VERSION)).toBe(BUMPED_FIX_VERSION);
});

it("throws exception on wrong format", () => {
    expect(() => {
        bumpFixVersion("wrong")
    }).toThrow(new Error("Error when parsing string: " + WRONG_VERSION));
});

const WRONG_VERSION = "wrong";
const VERSION = "v1.1.1";
const BUMPED_MINOR_VERSION = "v1.2.0";
const BUMPED_FIX_VERSION = "v1.1.2";
