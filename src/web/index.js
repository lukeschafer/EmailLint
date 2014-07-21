var express = require('express'),
	extras = require('express-extras'),
	app = express(),
	lint = require('../lib/domlint.js')
	assetManager = require('connect-assetmanager'),
	assetHandler = require('connect-assetmanager-handlers'),
	fs = require('fs');;

process.on('uncaughtException', function (err) {
	console.error(err);
});
	
lint.clients = require('../lib/clients.js');
require('../rules/dom.js')(lint);
require('../rules/link.js')(lint);
require('../rules/img.js')(lint);
require('../rules/css.js')(lint);

app.configure(function(){
	app.use(extras.fixIP());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	
	app.use(assetManager({ 
		css: { 
			dataType: 'css',
			path: __dirname + '/public/content/',
			files: [
				'css/bootstrap.css',
				'css/bootstrap-responsive.css',
				'css/font-awesome.css',
				'plugins/codemirror/codemirror.css',
				'css/emaillint.css'
			],
			route: /\/content\/([0-9.]+\/)?css\/style.css/,
			'preManipulate': {
				'^': [
					/*function(file, path, index, isLast, callback) {
						callback(file.replace(/url\s*\(/g, 'data-url(').replace(/data-url\(["']([^)]+)["']\)/g, 'data-url($1)'));
					}
					,*/ assetHandler.fixVendorPrefixes
					, assetHandler.fixGradients
					, assetHandler.replaceImageRefToBase64(__dirname + '/public/content/css/')
				]
			}
		},
		js: { 
			dataType: 'javascript',
			path: __dirname + '/public/content/',
			files: [
				'js/bootstrap.min.js',
				'plugins/codemirror/codemirror.js',
				'plugins/codemirror/modes/xml/xml.js',
				'js/emaillint.js'
			],
			route: /\/content\/([0-9.]+\/)?js\/script.js/
		}
	}));
});

var throttle = extras.throttle({
	urlCount: 10,
	urlSec: 10,
	holdTime: 10,
	whitelist: {
		'127.0.0.1': false
	}
});

function sendFile(fname, res) {
    fs.readFile(__dirname + fname, 'utf8', function(err, text){
        res.send(text);
    });
}
app.get('/', function(req, res) { sendFile('/public/index.html', res); });
app.get('/api', function(req, res) { sendFile('/public/api.html', res); });
app.get('/what', function(req, res) { sendFile('/public/what.html', res); });
app.get('/help', function(req, res) { sendFile('/public/help.html', res); });
app.get('/who', function(req, res) { sendFile('/public/who.html', res); });

app.get('/options', function(req, res) {
	var rules = lint.list();
	res.send(JSON.stringify({
		clients: lint.clients,
		categories: lint.categorised()
	}));
});

app.post('/submit', throttle, fixInput, check);
app.post('/check', throttle, fixInput, check);

function fixInput(req, res, next) {
	if (!/^<!DOCTYPE/.test(req.body.data)) req.body.data = '<!DOCTYPE html>' + req.body.data;
	/*if (/<html(?!.*<body)/ig.test(req.body.data)) {
		return res.send(JSON.stringify({success:false, ran: false, errors: ['html tag found but no body tag.']}));
	}*/
	next();
}

function check(req, res) {
	lint.run(req.body.data, req.body.clients, req.body.ignored, function(response) {
		if (!response.ran) return res.send(JSON.stringify({success:false, ran: false, errors: response.errors}));
		
		if (!response.errors || !response.errors.length) return res.send(JSON.stringify({success:true, ran: true}));
		response.errors.forEach(function(e) {
			e.failed = e.failed ? e.failed.length : 'N/A';
		});
		res.send(JSON.stringify({success:false, ran: true, errors: response.errors}));
	});
}

app.listen(8020);