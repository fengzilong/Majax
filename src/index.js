import Regular from 'regularjs';
import NetworkLogs from './components/NetworkLogs';
import NetworkDetails from './components/NetworkDetails';
import Editor from './components/Editor';

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
});

new App().$inject( document.getElementById( 'app' ) );
