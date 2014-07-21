/*
http://www.campaignmonitor.com/css/
http://www.campaignmonitor.com/guides/coding/guidelines/
http://kb.mailchimp.com/article/how-to-code-html-emails/
http://www.campaignmonitor.com/resources/will-it-work/forms/
http://www.campaignmonitor.com/resources/will-it-work/flash/
*/
var jsdom  = require("jsdom"),
	fs = require('fs'),
	path = require('path');
	lint = require('./lib/domlint.js');

lint.clients = require('./lib/clients.js');
require('./rules/dom.js')(lint);
require('./rules/link.js')(lint);
require('./rules/img.js')(lint);
require('./rules/css.js')(lint);

readTest('test_docs/test1.html', function(data) {
	lint.run(data, null, null, function(response) {
		if (response.errors) response.errors.forEach(function(e) { 
			if (e.exception) 
				console.error("EXCEPTION: " + e.exception + " running " + e.category + "." + e.item.name);
			else
				console.error(e.category + "." + e.name + (e.failed ? (' ('+e.failed.length+')') : '') + "\n\t::: " + e.extended) ;
		});
	});
});

function readTest(fname, callback) {
	fs.readFile(fname, 'utf8', function (err,data) {
	  if (err) {
		return console.log(err);
	  }
	  callback(data);
	});
}