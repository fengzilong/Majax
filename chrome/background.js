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
			// switch( message.type ) {
			//
			// }
		});
	}
});

function process( message ) {
	var request = message.request.request;
	request.basename = url( -1, request.url );
}
