var url = require('url');

module.exports = function(lint) {
	lint.addCategory('img', 'Image Support');
	
	lint('img', 'img_alt', 'Images should have "alt" attribute', 'In the case where images are not loaded, alt text should be provided to assist comprehension and screen readers', function(window, callback) {
		var failures = lint.testForEach(window,  window.$('img'), function(img) {
			return !!window.$(img).attr('alt');
		});
		callback(!failures, failures);
	});
	lint('img', 'img_src', 'Images must have valid "src"', '<img> tags will show nothing without "src" attribute, and it must be fully qualified or refer to an attachment (e.g. cid:image1.png)', function(window, callback) {
		var failures = lint.testForEach(window,  window.$('img'), function(img) {
			var src = window.$(img).attr('src');
			if (!src) return false;
			if (/^\s*cid:/.test(src)) return true;
			var parsed = url.parse(src);
			if (!parsed.protocol || !parsed.host || !(parsed.protocol == 'http:' || parsed.protocol == 'https:')) return false;
			return true;
		});
		callback(!failures, failures);
	});
	lint('img', 'img_src_chars', 'Image source must have not have invalid chars', '<img> tags will show nothing in some browsers if the value contains chars: $#& or space', function(window, callback) {
		var failures = lint.testForEach(window,  window.$('img'), function(img) {
			var src = window.$(img).attr('src');
			if (!src) return false;
			if (/[$#& ]/.test(src)) return false;
			return true;
		});
		callback(!failures, failures);
	});
	lint('img', 'img_size', 'Images should have height/width specified', 'In the case where images are not loaded, having a height and width specified helps the document render as intended', function(window, callback) {
		var failures = lint.testForEach(window,  window.$('img'), function(img) {
			img = window.$(img);
			var hasWidth = lint.helpers.hasValue(img.attr('width')) || lint.helpers.hasStyle(img, 'width');
			var hasHeight = lint.helpers.hasValue(img.attr('height')) || lint.helpers.hasStyle(img, 'height');
			return hasWidth && hasHeight;
		});
		callback(!failures, failures);
	});
}