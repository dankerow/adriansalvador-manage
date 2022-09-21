<template>
	<div>
		<div class="header bg-primary pt-4 pb-6">
			<div class="container-fluid">
				<div class="row align-items-center pb-5">
					<div class="col-7 col-md-7 col-lg-7">
						<h1 class="text-white">
							Hello {{ user.firstName }}
						</h1>
					</div>
				</div>
			</div>
		</div>

		<div class="container-fluid mt-n5">
			<div class="row justify-content-center">
				<div class="col-lg-10">
					<div class="card">
						<PurchaseOrdersEditForm
							:purchase-order="purchaseOrder"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	async asyncData({ params, $axios }) {
		const purchaseOrder = await $axios.$get(`/v1/purchase-orders/${params.id}`)

		return {
			purchaseOrder
		}
	},
	data({ $store }) {
		return {
			user: $store.state.auth.user,
			purchaseOrder: {}
		}
	}
}
</script>
