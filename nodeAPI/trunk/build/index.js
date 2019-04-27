"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const fileEncoder_1 = require("./common/fileEncoder");
const spawn = require("child_process").spawn;
var app = express();
app.use(function (req, res, next) {
    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400';
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});
app.use(bodyParser.json());
// app.use(express.static(__dirname + '/src/images'));
// app.use('/public/uploads', express.static(__dirname + '/src/images/input'));
app.use(morgan('dev'));
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/src/images/input');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.split(".")[0] + '.' + "jpg");
    }
});
var uploadSingle = multer({
    storage: storage
}).single('file');
app.get('/api/ImageLogs', function (req, res) {
    fs.readdir(__dirname + '/src/images/logs/', function (err, files) {
        var imageByteArray = [];
        files.forEach(file => {
            let path = __dirname + '/src/images/logs/' + file;
            var encodedData = fileEncoder_1.getEncodedDataFromFile(path);
            imageByteArray.push(encodedData);
        });
        res.send(imageByteArray);
    });
});
app.post('/api/uploadPhoto', function (req, res) {
    fs.readdir(__dirname + "/src/images/input", (err, files) => {
        if (err)
            res.send({ value: "error processing image", message: "error" });
        for (const file of files) {
            fs.unlink(path.join(__dirname + "/src/images/input", file), err => {
                if (err)
                    throw err;
            });
        }
        uploadSingle(req, res, function (err) {
            if (err) {
                res.json({ error_code: 1, err_desc: err });
                return;
            }
            if (req.body.GaugueType == "analog") {
                const pythonProcess = spawn('python', [__dirname + "/src/analog_gauge_reader.py"]);
                pythonProcess.stdout.on('data', (data) => {
                    console.log(data.toString('utf8'));
                    if (data.toString('utf8').includes("No images found for input")) {
                        res.send({ value: "error processing image", message: "error" });
                    }
                    else if (data.toString('utf8').includes("error")) {
                        res.send({ value: "error processing image", message: "error" });
                    }
                    else {
                        res.send({ value: Number(parseFloat(data.toString('utf8').substring(0, 6)).toFixed(2)), message: "success" });
                    }
                });
            }
            else if (req.body.GaugueType == "digital") {
                const path = __dirname + "/src/images/logs/cropped-1.jpg";
                const pythonProcess = spawn('python', [__dirname + "/src/digit-reader.py"]);
                pythonProcess.stdout.on('data', (data) => {
                    if (data.toString('utf8').includes("ok")) {
                        fs.unlink(__dirname + "/out.txt", () => {
                            var tesseractResult = spawn('tesseract', [path, './out', 'nobatch', 'digits', '&wait;', 'cat', './out.txt']);
                            tesseractResult.on('close', (code) => {
                                fs.exists(__dirname + "/out.txt", (exists) => {
                                    if (exists) {
                                        fs.readFile(__dirname + "/out.txt", (err, data) => {
                                            if (/\d/.test(data.toString('utf8'))) {
                                                res.send({ "value": data.toString('utf8').split('\n')[0], "message": "success" });
                                            }
                                            else {
                                                res.send({ "value": "error processing image", "message": "error" });
                                            }
                                        });
                                    }
                                    else {
                                        res.send({ "value": "error processing image", "message": "error" });
                                    }
                                });
                            });
                        });
                    }
                    else {
                        res.send({ "value": "error processing image", "message": "error" });
                    }
                });
            }
            else {
                res.send({ "value": "error", "message": "Guage Type is not Specified" });
            }
        });
    });
});
app.listen(process.env.PORT || 9000, function () { console.log("App listening on port 9000"); });
// let corsOptions = {
//     origin: 'http://localhost:4200',
//     optionsSuccessStatus: 200,
//     methods: "GET,PUT,POST,DELETE",// some legacy browsers (IE11, various SmartTVs) choke on 204 ,
//     // credentials: true
// }
// app.use(cors(corsOptions));
//# sourceMappingURL=index.js.map