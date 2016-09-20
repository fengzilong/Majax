import Regular from 'regularjs';

const Editor = Regular.extend({
	name: 'Editor',
	template: `
		<div ref="editor" style="position: absolute;width: 100%;height: -webkit-calc(100% - 67px);top: 67px;">{ content }</div>
	`,
	init: function() {
		var editor = ace.edit( this.$refs.editor );
		editor.setOptions({
			"selectionStyle": "line",
			"highlightActiveLine": true,
			"highlightSelectedWord": true,
			"readOnly": false,
			"cursorStyle": "ace",
			"mergeUndoDeltas": true,
			"behavioursEnabled": true,
			"wrapBehavioursEnabled": true,
			"hScrollBarAlwaysVisible": false,
			"vScrollBarAlwaysVisible": false,
			"highlightGutterLine": true,
			"animatedScroll": false,
			"showInvisibles": false,
			"showPrintMargin": false,
			"printMarginColumn": 80,
			"printMargin": false,
			"fadeFoldWidgets": false,
			"showFoldWidgets": true,
			"showLineNumbers": true,
			"showGutter": true,
			"fixedWidthGutter": true,
			"displayIndentGuides": false,
			"fontSize": "13px",
			"scrollPastEnd": 0,
			"theme": "clouds",
			"scrollSpeed": 2,
			"dragDelay": 0,
			"dragEnabled": true,
			"focusTimout": 0,
			"tooltipFollowsMouse": true,
			"firstLineNumber": 1,
			"overwrite": false,
			"newLineMode": "auto",
			"useWorker": false,
			"useSoftTabs": false,
			"tabSize": 4,
			"wrap": "off",
			"indentedSoftWrap": true,
			"mode": "json",
			"enableMultiselect": true,
			"enableBlockSelect": true,
		});
		editor.setTheme("ace/theme/chrome");

		var modes = {
			json: ace.require("ace/mode/json").Mode,
			javascript: ace.require("ace/mode/javascript").Mode,
			css: ace.require("ace/mode/css").Mode,
			html: ace.require("ace/mode/html").Mode,
			plain_text: ace.require("ace/mode/plain_text").Mode,
		};

		editor.$blockScrolling = Infinity;

		// 默认模式 -> plain_text
		this.data.mode = this.data.mode || 'plain_text';
		editor.session.setMode( new modes[ this.data.mode ]() );

		this.$watch('mode', function( nv, ov ) {
			if( !( nv in modes ) ) {
				nv = 'plain_text';
			}
			editor.getSession().setMode( new modes[ nv ]() );
		});
		this.$watch('content', function( nv, ov ) {
			editor.setValue( nv, -1 );
		});
		this.$watch('lint', function( v ) {
			console.log( 'changed:lint', v );
			editor.session.setOption('useWorker', v || false);
		});
	}
});

export default Editor;
