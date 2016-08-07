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
	}
});

function process( message ) {
	var request = message.request.request;
	request.domain = url( 'hostname', request.url );
	request.path = url( 'path', request.url );
}

//chrome.proxy.onProxyError.addListener(function(fatal, err, details){
//	console.log('proxy error - ',  fatal, err, details);
//});


//var pacScript = RuleManager.generatePacScript({
//	"1": {
//		"name": "1",
//		"urlPattern": "http://*.huaban.com/*",
//		"patternType": "wildcard",
//		"id": "1",
//		"dataType": ""
//	},
//	"2": {
//		"name": "2",
//		"urlPattern": "http://www.baidu.com/?",
//		"patternType": "regexp",
//		"id": "2",
//		"dataType": ""
//	},
//	"3": {
//		"name": "3",
//		"urlPattern": "https://www.baidu.com/favicon.ico",
//		"patternType": "regexp",
//		"id": "2",
//		"dataType": ""
//	},
//	"4": {
//		"name": "4",
//		"urlPattern": "http://www.beibei.com/resource/v2-261_262_263_264_265_266.html?callback=amsCallback",
//		"patternType": "wildcard",
//		"id": "2",
//		"dataType": ""
//	}
//});

//var config = {
//	mode: "pac_script",
//	pacScript: {
//		data: pacScript
//	}
//};

//chrome.proxy.settings.set({
//	value: config,
//	scope: 'regular'
//}, function(){

//});
