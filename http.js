/**
 * Created by zhangsb on 2017/10/18.
 */
var PORT = 4001;

var http = require('http');
var url = require('url');
var fs = require('fs');
var mine = require('./mine').types;
var path = require('path');
var mock = require('./mock');

var server = http.createServer(function (request, response) {
    var host = request.headers.host;
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join(".", pathname);
    //console.log(realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    fs.exists(realPath, function (exists) {
        if (!exists) {
            fs.readFile(path.join(__dirname, 'data/' + realPath + '.json'), {encoding: 'utf-8'}, function (err, bytesRead) {
                if (!err) {
                    var data = JSON.parse(bytesRead);
                    response.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    response.write(JSON.stringify(data));
                    response.end();
                } else {
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
                    response.write(err.toString());
                    response.end();
                }

            });
        } else {
            if(realPath == "./"){
                var locationUrl = "http://" + host + "/index.html";
                response.writeHead(302,{
                    'Location':locationUrl
                });
                response.end();
                return;
            }
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
