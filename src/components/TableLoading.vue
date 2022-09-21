<template>
	<div class="table-responsive">
		<table id="table-loading" :class="`table table-sm table-hover ${$colorMode.value === 'dark' ? 'table-dark' : '' } align-items-center`">
			<thead :class="$colorMode.value === 'dark' ? 'thead-dark' : 'thead-light'">
				<tr>
					<th v-for="column in columns" :key="column.prop" scope="col">
						{{ column.label }}
					</th>
				</tr>
			</thead>

			<tbody class="list">
				<tr v-for="item in itemCount" :key="item">
					<td v-for="column in columns" :key="`${item}-${column.prop}`">
						<div class="placeholder-glow">
							<span class="placeholder col-5 placeholder-xs" />
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	props: {
		itemCount: {
			type: Number,
			default: () => 8
		},
		columns: {
			type: Array,
			default: () => []
		}
	}
}
</script>
