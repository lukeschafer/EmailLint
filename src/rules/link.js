var url = require('url');
module.exports = function(lint) {
	lint.addCategory('link', 'Hyperlinks');
	
	lint('link', 'a_href_absolute', 'Links should be absolute', 'If a URL in a link is not absolute (referring to the full path to the resource, inc. http or https etc), then the link will not work correctly', function(window, callback) {
		var failures = lint.testForEach(window,  window.$('a[href]'), function(a) {
			var href = window.$(a).attr('href');
			if (!href) return true;
			if (/^\s*mailto:/.test(href)) return true;
			var parsed = url.parse(href);
			if (!parsed.protocol || !parsed.host || !(parsed.protocol == 'http:' || parsed.protocol == 'https:')) return false;
			return true;
		});
		callback(!failures, failures);
	});
}