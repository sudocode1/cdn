"use strict";
exports.__esModule = true;
require('dotenv').config();
var express = require("express");
var app = express();
var fileUpload = require('express-fileupload');
app.use(require('body-parser').urlencoded({ extended: false, limit: '10mb' }));
app.use(fileUpload({ debug: false }));
app.get('/', function (req, res) {
    res.send("\n    <form method=\"post\" action=\"/upload\" encType=\"multipart/form-data\" >\n    <input name=\"f\" type=\"file\" multiple=\"multiple\"> <br>\n    Key: <input name=\"key\" type=\"password\"> <br>\n    <button class=\"submitButton\" type=\"submit\">Upload</button>\n    </form>\n    ");
});
app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    if (req.body.key !== process.env.KEY) {
        return res.status(500).send('Key does not match.');
    }
    var send = "";
    (Array.isArray(req.files.f) ? req.files.f : [req.files.f]).forEach(function (file) {
        file.mv('./img/' + file.name, function (err) {
            if (err)
                return res.status(500).send(err);
            ;
        });
        send += "<a href=\"http://".concat(req.hostname, "/").concat(file.name, "\">").concat(file.name, "</a><br>");
    });
    res.send(send);
});
app.get('/:request', function (req, res) {
    res.send("\n    <meta property=\"og:title\" content=\"".concat(req.params.request, "\">\n    <meta property=\"og:type\" content=\"website\">\n\n    <meta name=\"twitter:card\" content=\"summary_large_image\">\n    <meta name=\"image_src\" content=\"/direct/").concat(req.params.request, "\">\n    <meta name=\"theme-color\" content=\"#4287f5\">\n    <meta property=\"og:image\" content=\"/direct/").concat(req.params.request, "\">\n    <meta property=\"twitter:image\" content=\"/direct/").concat(req.params.request, "\">\n    <meta property='og:image:url' content='/direct/").concat(req.params.request, "'/>\n\n    <script> window.location = \"/direct/").concat(req.params.request, "\" </script>\n    <noscript> <a href=\"/direct/").concat(req.params.request, "\">view</a> </noscript>\n    "));
});
app.get('/direct/:request', function (req, res) {
    console.log("./img/".concat(req.params.request));
    res.sendFile(require('path').join(process.cwd(), 'img/' + req.params.request));
});
app.listen(8535);
