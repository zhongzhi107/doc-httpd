/**
 * @license server.js 1.0.0 Copyright (c) 2013.
 * @author zhongzhi
 */

'use strict';

var path = require('path');
var fs = require('fs');
var mime = require('./mime').types;
var md = require('./node_modules/node-markdown/lib/markdown').Markdown;
var config = require('./config').config;

exports.endsWith = function(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
};

exports.getLine = function(filename, lineNo) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+lineNo > lines.length) {
      throw new Error('File end reached without finding line');
    }

    return lines[+lineNo];
}

/**
 * 获取文章标题
 *
 * @param {String} filename 路径地址
 * @return {String} 标题
 */
exports.getPageTitle = function(filename) {
    var h1 = exports.getLine(filename, 0);
    if (h1 !== '') {
        var title = h1.replace(/^\s*#\s*/, '');
    }

    return title;
}


/**
 * 获取路径中文件的扩展名
 *
 * @param {String} pathname 路径地址
 * @return {String} 文件扩展名
 */
exports.extname = function(pathname) {
    var unknown = 'unknown',
        ext = path.extname(pathname);

    if (ext && ext.length > 1) {
        // url is a file
        ext = ext ? ext.slice(1) : unknown;
    } else {
        ext = unknown;
    }

    return ext;
};

/**
 * 响应404错误
 *
 * @param {Object} response
 * @param {String} pathname 路径地址
 *
 */
exports.response404 = function(response, pathname) {
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    response.write('This request URL ' + pathname + ' was not found on this server.');
    response.end();
};

/**
 * 响应500错误
 *
 * @param {Object} response
 * @param {String} err 错误信息
 *
 */
exports.response500 = function(response, err) {
    response.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    response.end(err);
};

/**
 * 响应Markdown文档
 *
 * @param {Object} response
 * @param {String} file 文件路径
 *
 */
exports.responseMarkdown = function(response, file) {
    var tpl = fs.readFileSync('./templates/page.tpl', 'binary');
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write(tpl.toString().replace('{content}', md(file)), 'binary');
    response.end();
};

/**
 * 响应静态文件
 *
 * @param {Object} response
 * @param {String} file 文件地址
 * @param {String} ext 文件扩展名（不包含.）
 *
 */
exports.responseStatic = function(response, file, ext) {
    response.writeHead(200, {
        'Content-Type': mime[ext] || 'text/plain'
    });
    response.write(file, 'binary');
    response.end();
};

/**
 * 响应目录
 *
 * @param {Object} response
 * @param {String} path 路径地址
 * @param {String} mdExtensionName markdown文档扩展名（不含.）
 *
 */
exports.responseDir = function(response, pathname) {
    var content = '';
    var tpl = fs.readFileSync('./templates/dir.tpl');

    // TODO: 增加安全性检查，防止读取webroot外的文件
    pathname = config.documentRoot + pathname;

    // 遍历目录读取md文档（之前已经检查了路径存在且是目录）
    var files = fs.readdirSync(pathname);
    files.forEach(function(file) {
        if (exports.endsWith(file, '.' + config.mdExtensionName)) {
            // 只显示markdown文档
            var title = exports.getPageTitle(path.join(pathname, file));
            content += '<li><a href="' + file + '">' + title + '</a></li>';
        }
    });

    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write(tpl.toString().replace('{content}', content));
    response.end();
};

/**
 * 检查路径类型
 *
 * @param {Array} dirs 目录列表
 * @param {String} filename 路径地址
 *
 * @return {JSON}
 * @return {Boolean} exist 文件或目录是否存在
 * @return {Boolean} isFile 是否为文件，与isDirectory互斥
 * @return {Boolean} isDirectory 是否为目录，与isFile互斥
 * @return {String} path 存在的路径地址
 *
 */
exports.detectPath = function(dirs, filename) {
    var fullpath,
        json = {
            exist: 0,
            isFile: 0,
            isDirectory: 0,
            path: ''
        };

    for (var i = 0, length = dirs.length; i < length; i++) {
        fullpath = dirs[i] + filename;
        if (fs.existsSync(fullpath)) {
            json.exist = 1;
            json.path = fullpath;
            if (fs.lstatSync(fullpath).isFile()) {
                json.isFile = 1;
            } else {
                json.isDirectory = 1;
            }
            break;
        }
    }

    return json;
}


