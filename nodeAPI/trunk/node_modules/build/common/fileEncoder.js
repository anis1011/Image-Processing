"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function getEncodedDataFromFile(path) {
    try {
        if (!fs.existsSync(path)) {
            return 'file doesnot exists';
        }
        var dataContent = fs.readFileSync(path);
        return Buffer.from(dataContent).toString('base64');
    }
    catch (error) {
        // log.error("error while reading file.", "readFile");
        // log.error("error:" + error, "readFile");
        return;
    }
}
exports.getEncodedDataFromFile = getEncodedDataFromFile;
//# sourceMappingURL=fileEncoder.js.map