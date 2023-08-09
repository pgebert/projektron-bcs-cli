import {PathLike} from "fs";

const fs = require("fs");


export const readFromFile = (path: PathLike) => {

    if (!fs.existsSync(path)) {
        fs.closeSync(fs.openSync(path, 'w'));
    }

    return fs.readFileSync(path, "utf-8");
}

export const writeToFile = (path: PathLike, payload: string) => {

    if (!fs.existsSync(path)) {
        fs.closeSync(fs.openSync(path, 'w'));
    }

    fs.writeFileSync(path, payload);

}
