import {lineBreak, LOG_ERROR, logError, logHeader, logImportant, logSuccess} from "../ui/output-formatting";

export function showStepInfoOrFail(stepName, err, result) {
    logImportant(stepName);

    notifyError(err, stepName);
    notifySuccess(result);
}

export function createStepHandlingFunction(stepName, optionalHandler) {
    if (optionalHandler) {
        return (err, result) => {
            showStepInfoOrFail(stepName, err, result);
            return optionalHandler(stepName, err, result)
        };
    }
    return (err, result) => showStepInfoOrFail(stepName, err, result);
}

export function notifyError(err, stepName) {
    if (!err) {
        return;
    }
    logHeader("Failed: " + stepName, LOG_ERROR);
    logError("Errors: " + err);
    throw new Error(err);
}

function notifySuccess(result) {
    logSuccess("OK");

    if (result) {
        logSuccess("Result: " + JSON.stringify(result));
    }

    lineBreak();
}