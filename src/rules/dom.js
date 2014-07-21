module.exports = function(lint) {
	lint.addCategory('dom', 'DOM Structure');
	
	lint('dom', 'head_style', 'Disallow <style> in <head>', 'GMail does not support having <style> tags in <head>', 
		['GMail', 'GMailDroid'],
		function(window, callback) {
			callback(!window.$('head style').size());
		});
		
	lint('dom', 'body_style', 'Disallow <style> in <body>', 'GMail does do not support having <style> tags in <body>', 
		['GMail', 'GMailDroid'],
		function(window, callback) {
			callback(!window.$('body style').size());
		});
		
	lint('dom', 'head_link', 'Disallow <link> in <head>', 'Some clients do not support having <link> tags in <head>', 
		['GMail', 'GMailDroid', 'Yahoo', 'Live'],
		function(window, callback) {
			callback(!window.$('head link').size());
		});
		
	lint('dom', 'head_link', 'Disallow <link> in <body>', 'Some clients do not support having <link> tags in <body>', 
		['GMail', 'GMailDroid', 'Yahoo', 'Live'],
		function(window, callback) {
			callback(!window.$('body link').size());
		});
		
	lint('dom', 'script', 'Disallow JavaScript <script>', 'JavaScript is pretty much a big no-no in emails', 
		function(window, callback) {
			callback(!/<script/ig.test(window.__originalSource));
			//callback(!window.$('script').size());
		});
		
	lint('dom', 'html_events', 'Disallow JavaScript event attributes', 'E.G. onclick="...". JavaScript is pretty much a big no-no in emails', 
		function(window, callback) {
			var failures = lint.testForEach(window, window.$('*'), function(e) {
				return lint.helpers.noAttribute(e, ['onclick', 'onblur', 'onchange', 'onfocus', 'onreset', 'onselect', 'onsubmit', 'onabort', 'onkeydown', 'onkeypress', 'onkeyup', 'ondblclick', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup']);
			});
			callback(!failures, failures);
		});
		
	lint('dom', 'body_attr', 'Disallow Attributes on <body> tag', 'Many email clients strip out the body tag. Attributes tested: class, dir, id, lang, style, title and deprecated tags: alink, background, bgcolor, link, text, vlink', 
		function(window, callback) {
			var failures = lint.testForEach(window, window.$('body'), function(e) {
				return lint.helpers.noAttribute(e, ['class', 'dir', 'id', 'lang', 'style', 'alink', 'background', 'bgcolor', 'link', 'text', 'vlink']);
			});
			callback(!failures, failures);
		});
	/*
	lint('dom', 'max_width', 'Emails should not need to be wider than 600px', 'As stated by MailChimp, you should assume a max-width of 600px for best compatibility',
		function(window, callback) {
			var body = window.$('body');
			var oldStyle = body.attr('style');
			body.attr('style', (oldStyle ? ';' : '') + 'width:600px;overflow-x:scroll !important;');
			var hasScrollbar = (window.document.body.scrollWidth > body.width());
			body.attr('style', oldStyle);
			callback(!hasScrollbar);
		});
		*/
}