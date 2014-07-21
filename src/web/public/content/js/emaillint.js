function esc(v) {
	return $('<div/>').text(v).html();
}
function popoverArgs(e) {
	var clients = '<div><strong>Clients:</strong> ' + (!e.clients ? 'All' : e.clients.join(', ')) + '</div>'
	return {html : true, title: '<span>' + esc(e.name) + '</span>', content: '<div>' + esc(e.extended) + '</div>' + clients}
}
$(function() {
	var saveTimeout;
	var prevTimeout;
	var editor = CodeMirror.fromTextArea(document.getElementById("html"), {
		mode: {name: "xml", alignCDATA: true, htmlMode: true},
		lineNumbers: true,
		matchBrackets: true,
		onChange: function(){
			if (saveTimeout) clearTimeout(saveTimeout);
			saveTimeout = setTimeout(function() { editor.save(); }, 500);
			prevTimeout = setTimeout(refreshIframe, 1000);
		}
	});
	function refreshIframe() {
		var iframe=document.getElementById("preview_frame");
		var doc = iframe.document;
		if(iframe.contentDocument) doc = iframe.contentDocument;
		else if(iframe.contentWindow) doc = iframe.contentWindow.document;
		doc.open();
		doc.writeln(editor.getValue());
		doc.close();
	}
	prevTimeout = setTimeout(refreshIframe, 500);
	
	$('#clear').click(function(e) { e.preventDefault(); $('textarea[name=html]').val(''); editor.setValue(''); });
	$('#select-all').click(function(e) { e.preventDefault(); $('#options input[type=checkbox]').attr('checked', 'checked'); });
	$('#clear-all').click(function(e) { e.preventDefault(); $('#options input[type=checkbox]').removeAttr('checked'); });

	$('#submit').click(function(e) {
		e.preventDefault();
		if (editor && editor.save) editor.save()
		
		$('#results').html('<div class="alert alert-info"><strong>Processing</strong> please wait...</div>');
		var data = {
			data:$('textarea[name=html]').val(),
			clients: [],
			ignored: []
		};
		
		$('#options .clients input[type=checkbox]:checked').each(function(i, e) {
			data.clients.push($(e).attr('name'));
		});
		$('#options .rules input[type=checkbox]:not(:checked)').each(function(i, e) {
			data.ignored.push($(e).attr('name'));
		});
		
		$.ajax({
		  type: 'POST',
		  url: '/submit',
		  data: data,
		  dataType: 'json',
		  success: function(data) {
			if (!data.ran) {
				$('#results').html('<div class="alert alert-error"><i class="icon-exclamation-sign"></i> <strong>Couldn\'t run the analysis, is your document mal-formed?:</strong> '+data.errors.join(', ')+'</div>');
				return;
			}
			if (!data.success) {
				var errDiv = $('<div class="alert alert-error"><strong>Rule Violations:</strong></div>');
				var ul = $('<ul class="no-points"></ul>').appendTo(errDiv);
				$.each(data.errors, function(i,e) {
					if (e.exception)
						ul.append($('<li></li>').append('<i class="icon-exclamation-sign"></i> ', $('<span></span>').text(e.item.category + ": " + e.item.name + ' [ERR:' + e.exception + ']').popover(popoverArgs(e.item))));
					else {
						if (e.warning)
							ul.append($('<li class="warning"></li>').append('<i class="icon-warning-sign"></i> ', $('<span></span>').text(e.category + ": " + e.name).popover(popoverArgs(e))));
						else
							ul.append($('<li></li>').append('<i class="icon-exclamation-sign"></i> ', $('<span></span>').text(e.category + ": " + e.name).popover(popoverArgs(e))));
					}
				});
				$('#results').html(errDiv);
				return;
			}
			$('#results').html('<div class="alert alert-success"><i class="icon-tick"></i> <strong>Well done!</strong> Everything appears to be OK.</div>');
		  }
		}).error(function(xhr) {
			$('#results').html('<div class="alert alert-error"><strong>Error!</strong> ' + (xhr.status == 403 ? 'You are throttled, please wait a short while.' : 'unknown') + '</div>');
		});
	});

	function loadPage() {
		$.getJSON('/options', function(data) {
			function addCheckbox(container, item) {
				var chk = $('<input type="checkbox" checked="checked" />').attr('name', item.id);
				var lbl = $("<label></label>").append(chk).append($('<span></span>').text(item.name).popover(popoverArgs(item)));
				if (item.warning) lbl.addClass('warning');
				if (item.clients) chk.attr('data-clients', item.clients.join(','));
				
				container.append(lbl);
			}
			
			var optionsContainer = $('#options');
			
			var clients = $('<div class="span6 clients"></div>').append('<h3>Email Clients to Check</h3>');
			$.each(data.clients, function(i, item) { addCheckbox(clients, item); });
			
			var rules = $('<div class="span6 rules"></div>').append('<h3>Rules</h3>');
			$.each(data.categories, function(i, category) {
				var cat = $('<div></div>').append('<h4>'+category.name+'</h4>');
				$.each(category.rules, function(i, item) { addCheckbox(cat, item); });
				rules.append(cat);
			});
			
			optionsContainer.append(clients);
			optionsContainer.append(rules);
			
			$('#loading').addClass('hidden');
			$('#content').removeClass('hidden');
			editor.refresh();
		}).error(function(){
			$('#loading').empty().append(
				$('<div class="alert alert-error"><strong>Something BAD happened</strong> - there was some problem loading resources for the page. You might be throttled (if that\'s the case, wait a short while).<br /></div>')
				.append($('<button class="btn btn-primary">Retry</button>').click(loadPage))
			);
		});
	}
	loadPage();
	
	$('img[src*="8489db229aa0a66ab6b80ebbe0bb26cd.png"]').click(function() {
		$('body,html').animate({
			scrollTop: 0
		}, 500);
	});
});
reformal_wdg_domain    = "emaillint";
reformal_wdg_mode    = 0;
reformal_wdg_title   = "EmailLint";
reformal_wdg_ltitle  = "Leave feedback";
reformal_wdg_lfont   = "";
reformal_wdg_lsize   = "";
reformal_wdg_color   = "#FFA000";
reformal_wdg_bcolor  = "#516683";
reformal_wdg_tcolor  = "#FFFFFF";
reformal_wdg_align   = "left";
reformal_wdg_waction = 0;
reformal_wdg_vcolor  = "#9FCE54";
reformal_wdg_cmline  = "#E0E0E0";
reformal_wdg_glcolor  = "#105895";
reformal_wdg_tbcolor  = "#FFFFFF";
reformal_wdg_bimage = "8489db229aa0a66ab6b80ebbe0bb26cd.png";