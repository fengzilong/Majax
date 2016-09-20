import Regular from 'regularjs';

const NetworkDetails = Regular.extend({
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
			return content;
		},
		mode: function() {
			if( !this.data.detail ) {
				return 'plain_text';
			}
			var mimeType = this.data.detail.request.response.content.mimeType;
			var mode = 'plain_text';
			switch( mimeType ) {
				case 'application/json':
				case 'text/json':
					mode = 'json';
					break;
				case 'application/javascript':
				case 'application/x-javascript':
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

export default NetworkDetails;
