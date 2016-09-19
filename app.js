function shouldFilterMessage( message ) {
	return false;
	var mimeType = message.request.response.content.mimeType;
	// 过滤图片 等等...
	if(
		mimeType.indexOf( 'image/' ) === 0 ||
		mimeType === 'text/html' ||
		mimeType === 'text/css' ||
		mimeType === 'application/javascript' ||
		mimeType === 'application/x-shockwave-flash'
	) {
		return true;
	} else {
		return false;
	}
}

var NetworkLogs = Regular.extend({
	name: 'NetworkLogs',
	template: `
		<div class="header-container">
			<table class="header">
				<colgroup>
					{#if !brief}
						<col style="width: 220px;">
						<col style="width: 107px;">
						<col style="width: 107px;">
						<col style="width: 119px;">
						<col style="width: 148px;">
						<col class="corner">
					{#else}
						<col style="width: 200px;">
						<col class="corner">
					{/if}
				</colgroup>
				<tbody>
					<tr>
						<th class="name-column">
							<div>Name<div class="network-header-subtitle">Path</div></div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						{#if !brief}
						<th class="status-column">
							<div>Status<div class="network-header-subtitle">Text</div></div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						<th class="type-column">
							<div>Type</div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						<th class="size-column">
							<div>Size<div class="network-header-subtitle">Content</div></div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						<th class="time-column">
							<div>Time<div class="network-header-subtitle">Latency</div></div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						{/if}
						<th class="corner"></th>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="data-container">
			<table class="data">
				<colgroup>
					{#if !brief}
						<col style="width: 220px;">
						<col style="width: 107px;">
						<col style="width: 107px;">
						<col style="width: 119px;">
						<col style="width: 148px;">
						<col class="corner">
					{#else}
						<col style="width: 200px;">
						<col class="corner">
					{/if}
				</colgroup>
				<tbody>
					<tr class="data-grid-filler-row" style="height: 0px;">
						{#if !brief}
							<td class="top-filler-td"></td>
							<td class="top-filler-td"></td>
							<td class="top-filler-td"></td>
							<td class="top-filler-td"></td>
							<td class="top-filler-td"></td>
							<td class="corner top-filler-td"></td>
						{#else}
							<td class="top-filler-td"></td>
							<td class="corner top-filler-td"></td>
						{/if}
					</tr>

					{#list networkLogs as v}
					<tr
						class="{ v_index % 2 !== 0 ? 'odd' : '' } { v.request.response._error ? 'network-error-row' : '' } { v === selected ? 'selected' : '' }"
						on-click="{ this.onRowClicked( v ) }"
					>
						<td class="name-column" title="{ v.request.request.url }">
							{#if v.request.response.content.mimeType.indexOf( 'image/' ) === 0 && v.content}
								<div class="icon image"><img class="image-network-icon-preview" src="data:{ v.request.response.content.mimeType };base64,{ v.content }"></div>
							{#elseif v.request.response.content.mimeType === 'text/html'}
								<img class="icon document">
							{#elseif v.request.response.content.mimeType === 'application/javascript'}
								<img class="icon script">
							{#elseif v.request.response.content.mimeType === 'text/css'}
								<img class="icon stylesheet">
							{#else}
								<img class="icon">
							{/if}
							{ v.request.request.basename || '/' }
							<div class="network-cell-subtitle">
								{ v.request.request.url }
							</div>
						</td>
						{#if !brief}
						<td class="status-column">
							{#if !v.request.response._error}
								{ v.request.response.status }
								<div class="network-cell-subtitle">
									{ v.request.response.statusText }
								</div>
							{#else}
								(failed)
								<div class="network-cell-subtitle">
									{ v.request.response._error }
								</div>
							{/if}

						</td>
						<td class="type-column">
							{#if !v.request.response._error}
								{ v.request.response.content.mimeType }
							{/if}
						</td>
						<td class="size-column right">
							{ v.request.response._transferSize } B
							<div class="network-cell-subtitle">
								{ v.request.response.content.size } B
							</div>
						</td>
						<td class="time-column right">
							{ Math.round( v.request.time ) } ms
						</td>
						{/if}
						<td class="corner"></td>
					</tr>
					{/list}

					<tr class="data-grid-filler-row" style="height: auto;">
						{#if !brief}
							<td class="bottom-filler-td"></td>
							<td class="bottom-filler-td"></td>
							<td class="bottom-filler-td"></td>
							<td class="bottom-filler-td"></td>
							<td class="bottom-filler-td"></td>
							<td class="corner bottom-filler-td"></td>
						{#else}
							<td class="bottom-filler-td"></td>
							<td class="corner bottom-filler-td"></td>
						{/if}
					</tr>
				</tbody>
			</table>
		</div>
	`,
	config: function() {
		var self = this;
		this.data.networkLogs = [];
		port.onMessage.addListener(function( message, sender, sendResponse ) {
			// TODO: debounce && cache
			console.log( message );

			if( shouldFilterMessage( message ) ) {
				return;
			}

			self.data.networkLogs.push( message );
			self.$update();
		});
	},
	onRowClicked: function( v ) {
		this.data.selected = v;
		this.$emit( 'select', v );
	}
});

var Editor = Regular.extend({
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

var NetworkDetails = Regular.extend({
	name: 'NetworkDetails',
	template: `
		<div class="vbox flex-auto">
			<div style="height: 27px;display: flex;align-items: center;padding: 0 10px;">
				<span on-click="{ this.onClose() }">close</span>
			</div>
			<div style="height: 40px;display: flex;align-items: center;padding: 0 10px;">
				<input style="flex: 1;border: none;border-bottom: solid 1px #ccc;padding: 7px 10px;outline: none;height: 27px;" value="{ url }" type="text" />
				<button style="height: 27px;margin-left: 10px;" on-click="{ this.onSave() }">Save</button>
			</div>
			<Editor content="{ content }" mode="{ mode }" lint="{ lint }" on-change="{ this.onChange( $event ) }"></Editor>
		</div>
	`,
	onChange: function( v ) {
		this.editorContent = v;
		this.data.detail.saveContent = v;
	},
	onSave: function() {
		// TODO: save
	},
	onClose: function() {
		this.$emit( 'close' );
	},
	config: function() {

	},
	computed: {
		url: function() {
			if( !this.data.detail ) {
				return '';
			}
			return this.data.detail.saveUrl || this.data.detail.request.request.url;
		},
		content: function() {
			if( !this.data.detail ) {
				return '';
			}
			var content = this.data.detail.saveContent || this.data.detail.content || '';
			var mimeType = this.data.detail.request.response.content.mimeType;
			if( mimeType === 'application/json' ) {
				var parsed = {};
				try {
					parsed = JSON.parse( content );
				} catch(e) {
					return content;
				}
				return JSON.stringify(parsed, 0, 4).trim();
			} else {
				return content.trim();
			}
		},
		mode: function() {
			if( !this.data.detail ) {
				return 'plain_text';
			}
			var mimeType = this.data.detail.request.response.content.mimeType;
			var mode = 'plain_text';
			switch( mimeType ) {
				case 'application/json':
					mode = 'json';
					break;
				case 'application/javascript':
					mode = 'javascript'
					break;
				case 'text/html':
					mode = 'html';
					break;
				case 'text/css':
					mode = 'css';
					break;
				default:
					mode = 'plain_text';
			}
			return mode;
		},
		lint: function() {
			if( ~'json'.split( ' ' ).indexOf( this.$get( 'mode' ) ) ) {
				return true;
			}

			return false;
		}
	}
});

var App = Regular.extend({
	template: `
		<div class="toolbar">
			<div class="iconfont toolbar-clear">&#xe600;</div>
			<div class="toolbar-filters">
				{#list filters as filter}
				<div class="toolbar-filter { filtering === filter ? 'active' : '' }" on-click="{ this.onFilter( filter ) }">
					{ filter }
				</div>
				{/list}
			</div>
		</div>
		<div class="hbox flex-auto">
			<div class="vbox { showDetail ? 'flex-none brief' : '' }">
				<NetworkLogs
					brief="{ showDetail }"
					on-select="{ this.onSelect( $event ) }"
				></NetworkLogs>
			</div>

			{#if showDetail}
			<NetworkDetails
				detail="{ request }"
				on-close="{ this.onCloseDetail() }"
			></NetworkDetails>
			{/if}

			<div class="split-resizer" style="left: 246.4px; margin-left: -3px;"></div>
		</div>
	`,
	onSelect: function( v ) {
		this.data.request = v;
		this.data.showDetail = true;
		this.$update();
	},
	onCloseDetail: function() {
		this.data.showDetail = false;
		this.$update();
	},
	onFilter: function( filter ) {

	},
	config: function() {
		this.data.showDetail = false;
		this.data.filters = [
			'All',
			'JSON',
			'Doc',
			'JS',
			'CSS',
			'Img'
		];
		this.data.filtering = this.data.filters[ 0 ];
	}
})

new App().$inject( document.getElementById( 'app' ) );
