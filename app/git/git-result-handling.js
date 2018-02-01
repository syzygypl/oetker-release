import {lineBreak, LOG_ERROR, logError, logHeader, logImportant, logSuccess} from "../log/output-formatting";

export function showStepInfoOrFail(stepName, err, result) {
    logImportant(stepName);

    if (err) {
        notifyError(err, stepName);
    }

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

function notifyError(err, stepName){
    logHeader("Failed: " + stepName, LOG_ERROR);
    logError("Errors: " + JSON.stringify(err));
    process.exit(1);
}

function notifySuccess(result){
    logSuccess("OK");

    if (result) {
        logSuccess("Result: " + JSON.stringify(result));
    }

    lineBreak();
}