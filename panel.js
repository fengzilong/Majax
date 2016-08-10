var inspectedWindowTabId = chrome.devtools && chrome.devtools.inspectedWindow.tabId;

if( typeof inspectedWindowTabId !== 'undefined' ) {
	var port = chrome.runtime.connect({
		name: inspectedWindowTabId + '-from-devtools-page'
	});
}
