var NAME = chrome.i18n.getMessage( 'name' );

var inspectedWindowTabId = chrome.devtools.inspectedWindow.tabId;

if( typeof inspectedWindowTabId !== 'undefined' ) {
	console.log( 'inspectedWindowTabId', inspectedWindowTabId );

	var port = chrome.runtime.connect({
		name: inspectedWindowTabId + '-from-devtools'
	});

	chrome.devtools.panels.create(NAME, 'icon.png', '/panel.html', function( panel ){
		chrome.devtools.network.onRequestFinished.addListener(function( request ) {
			request.getContent(function( response ) {
				console.log( request );
				console.log( response );

				port.postMessage( {
					request: request,
					content: response
				} );
			});
		});
	});
}
