var connections = {};
chrome.runtime.onConnect.addListener(function( port ) {
	console.log( port );

	connections[ port.name ] = port;

	var connectionName = port.name;
	if( connectionName.endsWith( 'from-devtools' ) ) {
		port.onMessage.addListener(function( message ) {
			console.log( 'from devtools', message );
			var target = connections[ connectionName + '-page' ];
			// TODO: cache message if '...-page' connection is not come up yet
			if( target ) {
				process( message );
				target.postMessage( message );
			}
		});
	} else if( connectionName.endsWith( 'from-devtools-page' ) ) {
		port.onMessage.addListener(function( message ) {
			console.log( 'from devtools page', message );
			switch( message.type ) {
				case 'SAVE_PAC_SCRIPT':
					chrome.proxy.settings.get({
						incognito: false
					}, function( v ) {
						if(
							v.levelOfControl === 'controllable_by_this_extension' ||
							v.levelOfControl === 'controlled_by_this_extension'
						) {
							chrome.proxy.settings.clear({
								scope: 'regular'
							}, function() {
								var pacScript = RuleManager.generatePacScript([
									{
										"name": "1",
										"urlPattern": "http://*.huaban.com/*",
										"patternType": "wildcard",
										"id": "1",
									},
									{
										"name": "2",
										"urlPattern": "http://www.baidu.com/?",
										"patternType": "regexp",
										"id": "2",
									},
									{
										"name": "3",
										"urlPattern": "https://www.baidu.com/favicon.ico",
										"patternType": "regexp",
										"id": "2",
									}
								]);

								console.log( pacScript );

								// TODO: remove
								return;
								chrome.proxy.settings.set({
									value: {
										mode: "pac_script",
										pacScript: {
											data: pacScript
										}
									},
									scope: 'regular'
								}, function() {

								});
							});
						} else {
							console.warn( 'Not allowed modifying proxy settings' );
						}
					});
					break;
				default:

			}
		});
	}
});

function process( message ) {
	var request = message.request.request;
	request.domain = url( 'hostname', request.url );
	request.path = url( 'path', request.url );
}

chrome.proxy.onProxyError.addListener(function(fatal, err, details){
	console.log('proxy error - ',  fatal, err, details);
});
