import {COLOR_BLACK, COLOR_GREEN, COLOR_RED, RESET, UNDERSCORE} from "../configuration";

export function logHeader(headerText, logType) {
    let headerPart = "";

    if (headerText.length < 30) {
        headerPart = "-".repeat(33) + headerText + " ".repeat(30 - headerText.length) + "-".repeat(33);
    } else {
        headerPart = headerText;
    }

    log("-".repeat(96), logType);
    log(headerPart, logType);
    log("-".repeat(96), logType);
}

export function log(text, type) {
    if (type === LOG_IMPORTANT) {
        logImportant(text);
    } else if (type === LOG_SUCCESS) {
        logSuccess(text);
    } else if (type === LOG_ERROR) {
        logError(text);
    } else {
        logDefault(text);
    }
}

export function logDefault(text){
    console.log(RESET + COLOR_BLACK + text);
}

export function logImportant(text) {
    console.log(RESET + UNDERSCORE + text);
}

export function logSuccess(text) {
    console.log(RESET + COLOR_GREEN + text);
}

export function logError(text) {
    console.log(RESET + COLOR_RED + text);
}

export function lineBreak() {
    console.log();
}

export const LOG_IMPORTANT = "important";
export const LOG_SUCCESS = "success";
export const LOG_ERROR = "error";

console.warn = () => {};
console.error = () => {};