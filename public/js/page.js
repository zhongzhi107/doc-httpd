String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


var Doc = {
	config: {
		headerLevelShowInContents: 4
	}
};

Doc.init = function() {
		$(document).ready(function() {
			Doc.setTitle();

			var pathname = location.pathname;
			// list-page does not show document map
			if (!(pathname.endsWith('/index.md') || pathname.endsWith('/'))) {
				Doc.createDocumentMap();
			}

			//console.log(SyntaxHighlighter);
			if (SyntaxHighlighter) {
				SyntaxHighlighter.config.tagName = 'code';
				SyntaxHighlighter.defaults['toolbar'] = false;
				SyntaxHighlighter.defaults['gutter'] = false;
				$('pre>code').addClass('brush:js');
				SyntaxHighlighter.all();
			}
		});
};

Doc.setTitle = function() {
	document.title = $('h1').text();
};

Doc.createDocumentMap = function() {
	var headers = [],
		tagName,
		wrapper,
		fragment = document.createDocumentFragment();
	for (var i = 2; i < Doc.config.headerLevelShowInContents + 1; i++) {
		headers.push('h' + i);
	}
	//console.log(headers, $(headers.join(', ')));
	$.each($(headers.join(', ')), function(index, item) {
		$(this).after($('<a />').attr({
			name: $(this).text()
		}));
		$(this).clone().html('<a href="#' + $(this).text() + '">' + $(this).text() + '</a>').appendTo(fragment);
	});

	$(fragment).appendTo('#contents');
	$('#float-bar').show();
};

Doc.init();