import Regular from 'regularjs';
import port from '../connect';

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

const NetworkLogs = Regular.extend({
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

export default NetworkLogs;
