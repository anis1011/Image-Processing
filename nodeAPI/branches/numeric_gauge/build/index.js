"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fileEncoder_1 = require("./common/fileEncoder");
const spawn = require("child_process").spawn;
var app = express();
app.use(function (req, res, next) {
    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
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
app.use(express.static(__dirname + '/src/images'));
app.use('/public/uploads', express.static(__dirname + '/src/images/input'));
app.use(morgan('dev'));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/src/images/input');
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        cb(null, file.originalname.split(".")[0] + '.' + "jpg");
    }
});
var uploadSingle = multer({
    storage: storage
}).single('file');
app.get('/', function (req, res) {
    res.send('hello!!!');
});
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
        console.log(__dirname + "/src/images/input");
        if (err)
            throw err;
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
            const pythonProcess = spawn('python', [__dirname + "/src/analog_gauge_reader.py"]);
            pythonProcess.stdout.on('data', (data) => {
                if (data.toString('utf8').includes("No images found for input")) {
                    res.send({ "value": "error processing image", "message": "error" });
                }
                else if (data.toString('utf8').includes("error")) {
                    res.send({ "value": "error processing image", "message": "error" });
                }
                else {
                    res.send(JSON.stringify({ "value": Number(parseFloat(data.toString('utf8').substring(0, 6)).toFixed(2)), "message": "success" }));
                }
            });
        });
    });
});
app.listen(process.env.PORT || 9000, function () { console.log("App listening on port 9000"); });
let corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods: "GET,PUT,POST,DELETE",
};
app.use(cors(corsOptions));
//# sourceMappingURL=index.js.map