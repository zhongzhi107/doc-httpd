//var md = require("./node_modules/node-markdown/lib/markdown.js").Markdown;
//
//var md_text = "**bold** *italic* [link](http://www.neti.ee) `code block`";
//
//console.log("--all");
//console.log(md(md_text));
//
//console.log("--only <strong> and <code>")
//console.log(md(md_text, true, 'strong|code'));
//
//console.log("--only <a> with _href_")
//console.log(md(md_text, true, 'a', {a:'href'}));

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// set your document root
var DOCUMENT_ROOT = '../doc_svn';
var PORT = 8000;

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var md = require('./node_modules/node-markdown/lib/markdown.js').Markdown;
var mime = require('./mime').types;

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;

	// set default page
	if (pathname.endsWith('/')) {
		pathname += 'index.md';
	}

	var ext = path.extname(pathname);
	ext = ext ? ext.slice(1) : 'unknown';

	var isMD = (ext == 'md');

    var realPath = (isMD ? DOCUMENT_ROOT : './public') + pathname;
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write('This request URL ' + pathname + ' was not found on this server.');
            response.end();
        } else {
            fs.readFile(realPath, 'binary', function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    if (isMD) {
						var contentType = mime[ext] || 'text/plain';
						response.writeHead(200, {
							'Content-Type': contentType
						});

						var tpl = fs.readFileSync('./templates/page.tpl', 'binary');
						response.write(tpl.toString().replace('{content}', md(file)), 'binary');
                    }
					else {
						response.writeHead(200, {
							'Content-Type': 'text/css'
						});
						response.write(file, 'binary');
					}
                    response.end();
                }
            });
        }
    });
});

server.listen(PORT);
console.log('Server runing at port: ' + PORT + '.');
console.log('document root: ' + DOCUMENT_ROOT);