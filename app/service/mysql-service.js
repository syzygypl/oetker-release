import * as mysql from "mysql";
import {promisify} from "util";
import {notifyError} from "../git/git-result-handling";
import {lineBreak, logImportant} from "../ui/output-formatting";

export async function blockCmsLogin() {
    let connection;
    try {
        logImportant("Connecting to database");
        connection = await connect();
    } catch (e) {
        notifyError(e, "Connecting to database");
    }
    lineBreak();

    try {
        logImportant("Querying");
        await promisify(connection.query(''));
    } catch (e) {
        notifyError(e, "Querying");
    }
    lineBreak();
}

export function connect(parameters) {
    return promisify(mysql.createConnection(parameters));
}