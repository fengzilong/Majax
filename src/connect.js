const inspectedWindowTabId = chrome.devtools && chrome.devtools.inspectedWindow.tabId;

let port;
if( typeof inspectedWindowTabId !== 'undefined' ) {
	port = chrome.runtime.connect({
		name: inspectedWindowTabId + '-from-devtools-page'
	});
}

export default port;
