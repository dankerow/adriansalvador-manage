<template>
	<div id="addAlbumModal" class="modal fade" tabindex="-1" aria-labelledby="Add Album Modal" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-body">
					<h4 class="heading-small text-muted mb-4">
						Asset information
					</h4>

					<div class="pl-lg-4">
						<div class="row">
							<div class="col-lg-4">
								<div class="form-group">
									<label class="form-label" for="inventoryTag">
										Inventory tag <span style="color: red;">*</span>
									</label>

									<input
										id="inventoryTag"
										v-model="form.inventoryTag"
										type="text"
										name="inventoryTag"
										class="form-control"
										placeholder="Inventory tag"
										required
									>
								</div>
							</div>

							<div class="col-lg-4">
								<div class="form-group">
									<label class="form-label" for="AMR">
										AMR <span style="color: red;">*</span>
									</label>

									<input
										id="AMR"
										v-model="form.AMR"
										type="text"
										name="AMR"
										class="form-control"
										placeholder="AMR"
										required
									>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-lg-4">
								<div class="form-group">
									<label class="form-label" for="price">
										Price <span style="color: red;">*</span>
									</label>

									<input
										id="price"
										v-model="form.price"
										type="text"
										name="price"
										class="form-control"
										placeholder="Asset price"
										required
									>
								</div>
							</div>

							<div class="col-lg-4">
								<div class="form-group">
									<label class="form-label" for="serialNumber">
										Serial number <span style="color: red;">*</span>
									</label>

									<input
										id="serialNumber"
										v-model="form.serialNumber"
										type="text"
										name="serialNumber"
										class="form-control"
										placeholder="Serial number"
										required
									>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-4">
								<div class="form-group">
									<label class="form-label" for="loan">Loan</label>

									<select id="loan" v-model="form.loan" class="form-select" name="loan" required>
										<option value="0" type="number" selected>
											False
										</option>
										<option value="1" type="number">
											True
										</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<hr class="my-4">

					<div class="row">
						<div class="col-lg-10 text-center">
							The date of acquisition will be automatically added, corresponding to the order date written on the purchase order.
						</div>
					</div>

					<hr class="my-4">

					<h4 class="heading-small text-muted mb-4">
						More
					</h4>

					<div class="pl-lg-4">
						<div class="form-group">
							<label class="form-label" for="comment">
								Comment
							</label>

							<textarea
								id="comment"
								v-model="form.comment"
								name="comment"
								rows="4"
								class="form-control"
								placeholder="A few more words about the asset..."
							/>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-sm btn-primary" data-bs-dismiss="modal">
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				inventoryTag: '',
				amr: '',
				purchaseOrder: '',
				price: 0,
				serialNumber: '',
				holder: '',
				type: 0,
				model: 0,
				status: 1,
				loan: 0,
				comment: ''
			}
		}
	},
	methods: {
		async submitForm(event) {
			try {
				const data = await this.$store.dispatch('albums/add', { ...this.form })
				const toast = new this.$Toast({
					title: 'Notification',
					body: 'The asset was successfully added.'
				})

				event.target.reset()
			} catch (e) {
				const toast = new this.$Toast({
					title: 'Something went wrong!',
					body: error.response.data.error.message
				})
			}
		}
	}
}
</script>
