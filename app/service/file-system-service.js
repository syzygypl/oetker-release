import * as fs from "fs";

export function rmdirSyncRec(path) {
    if (!fs.existsSync(path)) {
        return;
    }

    fs.readdirSync(path).forEach((file) => {
        const curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
            rmdirSyncRec(curPath);
        } else {
            fs.unlinkSync(curPath);
        }
    });

    fs.rmdirSync(path);
}
