var lint,
	lints = [],
	categories = {},
	_ = require('underscore'),
	jsdom  = require("jsdom"),
	cssom = require('cssom');
	
module.exports = lint = function(category, id, name, extended, clients, test) {
	if (typeof clients == 'function') { test = clients; clients = null; }
	var item = {category: category, id:id, name:name, extended: extended, clients: clients, test: test};
	lints.push(item);
	return item;
}

lint.clients = [];

lint.run = function(data, clientsArray, ignoredArr, callback) {
	console.log(__dirname)
	jsdom.env(data, [__dirname + "/jquery-1.7.1.js"], function (errors, window) {
		if (errors) { console.log(errors); callback({ran:false, errors:[errors]}) }
		lint.createJQueryHelpers(window);
		window.__originalSource = data;
		evaluate(window, clientsArray, ignoredArr, callback);
	});
};

function evaluate(window, clients, ignoredArr, callback) {
	if (typeof clients == 'function') { callback = clients; clients = null; }
	
	var ignored = {};
	(ignoredArr || []).forEach(function(ign) { ignored[ign] = true; });
	
	var errors = [];
	var executed = 0;
	lints.forEach(function(item) {
		if (item.clients && clients) {
			if (!_.intersection(item.clients, clients).length) {
				executed++;
				if (executed >= lints.length) callback({ran:true, errors:errors});
				return;
			}
		}
		if (ignored[item.id]) {
			executed++;
			if (executed >= lints.length) callback({ran:true, errors:errors});
			return;
		}
		try {
			item.test(window, function(pass, failed) {
				if (!pass) {
					item.failed = failed || null;
					errors.push(item);
				}
				executed++;
				if (executed >= lints.length) callback({ran:true, errors:errors});
			});
		} catch(e) {
			errors.push({exception: e.message ? e.message : e, item: item});
			executed++;
			if (executed >= lints.length) callback({ran:true, errors:errors});
		}
	});
}

lint.list = function() { return lints; };

lint.categorised = function() { 
	var cats = {};
	lints.forEach(function(item) {
		cats[item.category] = cats[item.category] || {name:categories[item.category].name, rules: []};
		cats[item.category].rules.push(item);
	});
	return _.select(cats, function(v, k) {
		return {id: k, name: v.name, rules: v.rules};
	});
};

lint.addCategory = function(id, name) {
	categories[id] = categories[id] || {};
	categories[id].name = name;
}

lint.createJQueryHelpers = function(window) {
	window.$.fn.getStyles = function() {
		var me = window.$(this);
		var data = me.data('cachedStyles');
		if (!data) me.data('cachedStyles', data = css(me));
		return data;
		
		function css(a){
			var sheets = window.document.styleSheets, o = {};
			
			var styleTags = window.$('style');
			for(var i = 0; i < styleTags.size(); i++) {
				sheets.push(cssom.parse(styleTags[0].innerHTML));
			}
			for(var i in sheets) {
				var rules = sheets[i].rules || sheets[i].cssRules;
				for(var r in rules) {
					if(a.is(rules[r].selectorText)) {
						o = window.$.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
					}
				}
			}
			o = window.$.extend(o, css2json(a.attr('style')));
			return o;
		}

		function css2json(css){
			var s = {};
			if(!css) return s;
			if(css instanceof cssom.CSSStyleDeclaration) {
				for(var i in css) {
					if((css[i]).toLowerCase) {
						s[(css[i]).toLowerCase()] = (css[css[i]]);
					}
				}
			} else if(typeof css == "string") {
				css = css.split("; ");          
				for (var i in css) {
					var l = css[i].split(": ");
					s[l[0].toLowerCase()] = (l[1]);
				};
			}
			return s;
		}
	}
};

lint.testForEach = function(window, elems, tester) {
	var failures = [];
	for(var i = 0; i < elems.size(); i++) {
		var e = window.$(elems[i]);
		if (!tester(e)) failures.push(e);
	};
	return failures.length ? failures : null;
};

lint.helpers = {
	hasValue: function(val) {
		if (!val) return false;
		val = val.replace(/^\s*|\s*;?\s*$/, '');
		return !(!val || val == '0' || val == '0px' || val == 'auto' || val == 'inherit');
	},
	hasStyle: function(e, allowed) {
		if (typeof allowed == 'string') allowed = [allowed];
		var styles = e.getStyles();
		for(var i = 0; i < allowed.length; i++) {
			if (!lint.helpers.hasValue(styles[allowed[i]])) return false;
		}
		return true;
	},
	noStyle: function(e, disallowed) {
		if (typeof disallowed == 'string') disallowed = [disallowed];
		var styles = e.getStyles();
		for(var i = 0; i < disallowed.length; i++) {
			if (lint.helpers.hasValue(styles[disallowed[i]])) return false;
		}
		return true;
	},
	noStyleValue: function(e, disallowedStyle, value) {
		if (typeof disallowed == 'string') disallowed = [disallowed];
		var styles = e.getStyles();
		if (!styles[disallowedStyle]) return true;
		
		if (value.constructor == RegExp) {
			if (value.test(styles[disallowedStyle])) return false;
		} else {
			if (styles[disallowedStyle].toLowerCase().indexOf(value.toLowerCase()) >= 0) return false;
		}
		return true;
	},
	noAttribute: function(e, disallowed) {
		if (typeof disallowed == 'string') disallowed = [disallowed];
		for(var i = 0; i < disallowed.length; i++) {
			if (e.attr(disallowed[i])) return false;
		}
		return true;
	}
};