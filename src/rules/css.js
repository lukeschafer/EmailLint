var prefixRegexs = {};
module.exports = function(lint) {
	lint.addCategory('css', 'CSS/Style Support');
	
	lint('css', 'div_padding', 'Disallow padding on <div>', 'Some clients do not support having box-model styles on <div> tags', function(window, callback) {
		var failures = lint.testForEach(window, window.$('div'), function(div) {
			return lint.helpers.noStyle(div, ['padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom']);
		});
		callback(!failures, failures);
	});
	lint('css', 'p_padding', 'Disallow padding on <p>', 'Some clients do not support having box-model styles on <p> tags', function(window, callback) {
		var failures = lint.testForEach(window, window.$('p'), function(e) {
			return lint.helpers.noStyle(e, ['padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom']);
		});
		callback(!failures, failures);
	});
	lint('css', 'width', 'Disallow "width" on p, div, span', 'CSS style "height"', ['Outlook07'], function(window, callback) {
			var failures = lint.testForEach(window, window.$('p,div,span'), function(e) {
				return lint.helpers.noStyle(e, ['width']);
			});
			callback(!failures, failures);
		});
	lint('css', 'float', 'Disallow "float" on everything', 'CSS float style support is "flaky"', ['GMail', 'GMailDroid', 'Outlook07'], disableStyleOnAll('float'));
	lint('css', 'direction', 'Disallow "direction" on everything', 'CSS style "direction"', ['Outlook07'], disableStyleOnAll('direction'));
	lint('css', 'text_overflow', 'Disallow "text-overflow" on everything', 'CSS style "text-overflow"', ['Outlook07'], disableStyleOnAll('text-overflow'));
	lint('css', 'text_overflow_ellipsis', 'Disallow "text-overflow:ellipsis" on everything', 'CSS style "text-overflow" of value "ellipsis"', ['Live', 'Yahoo', 'GMail'], disableStyleValueOnAll('text-overflow', 'ellipsis'));
	lint('css', 'text_shadow', 'Disallow "text-shadow" on everything', 'CSS style "text-shadow"', ['Outlook07', 'Outlook03'], disableStyleOnAll('text-shadow'));
	lint('css', 'white_space', 'Disallow "white-space" on everything', 'CSS style "white-space"', ['Outlook03'], disableStyleOnAll('white-space'));
	lint('css', 'word_spacing', 'Disallow "word-spacing" on everything', 'CSS style "word-spacing"', ['Outlook07'], disableStyleOnAll('word-spacing'));
	lint('css', 'word_wrap', 'Disallow "word-wrap" on everything', 'CSS style "word-wrap"', ['Outlook07', 'GMail', 'GMailDroid'], disableStyleOnAll('word-wrap'));
	lint('css', 'vertical_align', 'Disallow "vertical-align" on everything', 'CSS style "vertical-align"', ['Outlook07'], disableStyleOnAll('vertical-align'));
	lint('css', 'background_image', 'Disallow "background-image" on everything', 'CSS style "background-image"', ['Outlook07', 'Live', 'GMailDroid'], function(window, callback) {
		var failures = lint.testForEach(window, window.$('*'), function(e) {
			return lint.helpers.noStyle(e, 'background-image') && lint.helpers.noStyleValue(e, 'background', /url\s*\(/ig);
		});
		callback(!failures, failures);
	});
	lint('css', 'background_position', 'Disallow "background-position" on everything', 'CSS style "background-position"', ['Outlook07', 'Live', 'GMail', 'GMailDroid'], disableStyleOnAll('background-position'));
	lint('css', 'background_repeat', 'Disallow "background-repeat" on everything', 'CSS style "background-repeat"', ['Outlook07', 'Live', 'GMail', 'GMailDroid'], disableStyleOnAll('background-repeat'));
	lint('css', 'opacity', 'Disallow "opacity" on everything', 'CSS style "opacity"', ['Outlook07', 'Outlook03', 'Yahoo', 'GMail', 'GMailDroid'], disableStyleOnAll('opacity'));
	lint('css', 'box_shadow', 'Disallow "box_shadow" on everything', 'CSS style "box_shadow"', disableStyleOnAll('box_shadow'));
	lint('css', 'height', 'Disallow "height" on everything', 'CSS style "height"', ['Outlook07'], disableStyleOnAll('height'));
	lint('css', 'max_width', 'Disallow "max-width" on everything', 'CSS style "max-width"', ['Outlook07', 'Outlook03', 'Live'], disableStyleOnAll('max-width'));
	lint('css', 'list_style_image', 'Disallow "list-style-image" on everything', 'CSS style "list-style-image"', ['Outlook07', 'Live', 'GMail', 'GMailDroid'], disableStyleOnAll('list-style-image'));
	lint('css', 'list_style_position', 'Disallow "list-style-position" on everything', 'CSS style "list-style-position"', ['Outlook07', 'Live', 'GMail', 'GMailDroid'], disableStyleOnAll('list-style-position'));
	lint('css', 'list_style_type', 'Disallow "list-style-type" on everything', 'CSS style "list-style-type"', ['Outlook07', 'GMailDroid'], disableStyleOnAll('list-style-type'));
	lint('css', 'border_spacing', 'Disallow "border-spacing" on tables', 'CSS style "border-spacing"', ['Outlook07', 'Outlook03'], disableStyleOnTables('border-spacing'));
	lint('css', 'caption_side', 'Disallow "caption-side" on tables', 'CSS style "caption-side"', ['Outlook07', 'Outlook03', 'IPhone', 'Apple'], disableStyleOnTables('caption-side'));
	lint('css', 'empty_cells', 'Disallow "empty-cells" on tables', 'CSS style "empty-cells"', ['Outlook07', 'Outlook03'], disableStyleOnTables('empty-cells'));
	lint('css', 'Margin', '"Margin[-*] should have capital "M" for outlook.com', ['Outlook.com'], disableStyleOnAll('margin', 'margin-top', 'margin-left', 'margin-botton', 'margin-right')).warning = true;;
	
	lint('css', 'prefix_ms', 'Warn when vendor prefix is used: "-ms-"', 'Vendor prefixes are intended for display styles in web browsers and are unlikely to be supported in most clients.', disableVendorPrefix('-ms-')).warning = true;
	lint('css', 'prefix_mso', 'Warn when vendor prefix is used: "mso-"', 'Vendor prefixes are intended for display styles in web browsers and are unlikely to be supported in most clients.', disableVendorPrefix('mso-')).warning = true;
	lint('css', 'prefix_moz', 'Warn when vendor prefix is used: "-moz-"', 'Vendor prefixes are intended for display styles in web browsers and are unlikely to be supported in most clients.', disableVendorPrefix('-moz-')).warning = true;
	lint('css', 'prefix_o', 'Warn when vendor prefix is used: "-o-"', 'Vendor prefixes are intended for display styles in web browsers and are unlikely to be supported in most clients.', disableVendorPrefix('-o-')).warning = true;
	lint('css', 'prefix_atsc', 'Warn when vendor prefix is used: "-atsc-"', 'Vendor prefixes are intended for display styles in web browsers and are unlikely to be supported in most clients.', disableVendorPrefix('-atsc-')).warning = true;
	lint('css', 'prefix_wap', 'Warn when vendor prefix is used: "-wap-"', 'Vendor prefixes are intended for display styles in web browsers and are unlikely to be supported in most clients.', disableVendorPrefix('-wap-')).warning = true;
	lint('css', 'prefix_webkit', 'Warn when vendor prefix is used: "-webkit-"', 'Vendor prefixes are intended for display styles in web browsers and are unlikely to be supported in most clients.', disableVendorPrefix('-webkit-')).warning = true;
	lint('css', 'prefix_khtml', 'Warn when vendor prefix is used: "-khtml-"', 'Vendor prefixes are intended for display styles in web browsers and are unlikely to be supported in most clients.', disableVendorPrefix('-khtml-')).warning = true;
		
	function disableStyleOnAll(style, maintainCase)
	{
		if (typeof style == 'string') style = [style];
		return function(window, callback) {
			var failures = lint.testForEach(window, window.$('*'), function(e) {
				return lint.helpers.noStyle(e, style, maintainCase);
			});
			callback(!failures, failures);
		}
	}
	function disableStyleValueOnAll(style, value)
	{
		return function(window, callback) {
			var failures = lint.testForEach(window, window.$('*'), function(e) {
				return lint.helpers.noStyleValue(e, style, value);
			});
			callback(!failures, failures);
		}
	}
	
	function disableStyleOnTables(style)
	{
		return function(window, callback) {
			var failures = lint.testForEach(window, window.$('table, tr, td, th'), function(e) {
				return lint.helpers.noStyle(e, [style]);
			});
			callback(!failures, failures);
		}
	}
	
	function disableVendorPrefix(prefix) 
	{
		var r = prefixRegexs[prefix] = (prefixRegexs[prefix] || new RegExp("^[ ]*" + prefix, "ig"));
		return function(window, callback) {
			var failures = lint.testForEach(window, window.$('*'), function(e) {
				var styles = e.getStyles();
				for (var k in styles) {
					if (r.test(k)) return false;
				}
				return true;
			});
			callback(!failures, failures);
		};
	}
}