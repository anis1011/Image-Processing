import * as fs from 'fs';

export function getEncodedDataFromFile (path){

    try
    {
    if (!fs.existsSync(path)) {
    return 'file doesnot exists';
    }
    
    var dataContent = fs.readFileSync(path);
    
    return Buffer.from(dataContent).toString('base64');
    } 
    catch (error)
    {
    // log.error("error while reading file.", "readFile");
    // log.error("error:" + error, "readFile");
    
    return;
    }
    }