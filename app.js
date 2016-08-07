var App = Regular.extend({
	template: `
		<div class="header-container">
			<table class="header">
				<colgroup>
					<col style="width: 220px;">
					<col style="width: 107px;">
					<col style="width: 77px;">
					<col style="width: 119px;">
					<col style="width: 148px;">
					<col class="corner">
				</colgroup>
				<tbody>
					<tr>
						<th class="name-column sortable">
							<div>Name<div class="network-header-subtitle">Path</div></div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						<th class="status-column sortable">
							<div>Status<div class="network-header-subtitle">Text</div></div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						<th class="type-column sortable">
							<div>Type</div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						<th class="size-column sortable">
							<div>Size<div class="network-header-subtitle">Content</div></div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						<th class="time-column sortable">
							<div>Time<div class="network-header-subtitle">Latency</div></div><div class="sort-order-icon-container"><div class="sort-order-icon"></div></div>
						</th>
						<th class="corner"></th>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="data-container">
			<table class="data">
				<colgroup>
					<col style="width: 220px;">
					<col style="width: 107px;">
					<col style="width: 77px;">
					<col style="width: 119px;">
					<col style="width: 148px;">
					<col class="corner">
				</colgroup>
				<tbody>
					<tr class="data-grid-filler-row revealed" style="height: 0px;">
						<td class="top-filler-td"></td>
						<td class="top-filler-td"></td>
						<td class="top-filler-td"></td>
						<td class="top-filler-td"></td>
						<td class="top-filler-td"></td>
						<td class="corner top-filler-td"></td>
					</tr>

					{#list networkLogs as v}
					<tr class="revealed { v_index % 2 !== 0 ? 'odd' : '' } { v.request.response._error ? 'network-error-row' : '' }">
						<td class="name-column" title="{ v.request.request.url }">
							<img class="icon">
							{ v.request.request.path || '/' }
							<div class="network-cell-subtitle">
								{ v.request.request.domain }
							</div>
						</td>
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
						<td class="corner"></td>
					</tr>
					{/list}

					<tr class="data-grid-filler-row revealed" style="height: auto;">
						<td class="bottom-filler-td"></td>
						<td class="bottom-filler-td"></td>
						<td class="bottom-filler-td"></td>
						<td class="bottom-filler-td"></td>
						<td class="bottom-filler-td"></td>
						<td class="corner bottom-filler-td"></td>
					</tr>
				</tbody>
			</table>
		</div>
	`,
	config: function() {
		var self = this;
		this.data.networkLogs = [];
		port.onMessage.addListener(function( message, sender, sendResponse ) {
			console.log( message );
			self.data.networkLogs.push( message );
			self.$update();
		});
	}
});

new App().$inject( document.getElementById( 'app' ) );
