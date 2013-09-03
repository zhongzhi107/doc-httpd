/**
 * @license server.js 1.0.0 Copyright (c) 2013.
 * @author zhongzhi
 */

 'use strict';

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var config = require('./config').config;
var util = require('./util');

var server = http.createServer(function (request, response) {
    var dirs = [config.documentRoot, './public'];
    var pathname = url.parse(request.url).pathname;
    var realpath, ext;
    var info = util.detectPath(dirs, pathname);

    if (info.exist) {
        if (info.isFile) {
            fs.readFile(info.path, 'binary', function (err, file) {
                if (err) {
                    // read file error
                    util.response500(response, err);
                } else {
                    ext = util.extname(pathname);
                    switch (ext) {
                        case config.mdExtensionName:
                            util.responseMarkdown(response, file);
                            break;

                        default:
                            util.responseStatic(response, file, ext);
                    }
                }
            });
        } else {
            // show file list page
            util.responseDir(response, pathname);
        }

    } else {
        // 404 not found
        util.response404(response, pathname);
    }

});

server.listen(config.port);
console.log('Server runing at port: ' + config.port + '.');
console.log('document root: ' + config.documentRoot);