<template>
	<div>
		<div :class="`header ${$colorMode.value === 'dark' ? 'bg-darker' : '' } pt-4 pb-6`">
			<div class="container-fluid">
				<div class="row align-items-center">
					<div class="col-6 col-md-3 col-lg-4">
						<div class="icon icon-shape icon-shape-dark me-2 shadow-sm">
							<FolderOpenIcon />
						</div>
						<h3 class="fw-bolder text-uppercase d-inline-block mb-0">
							Albums
						</h3>
					</div>

					<div class="col-6 col-md-9 col-lg-8 text-end">
						<button :class="`btn btn-sm ${$colorMode.value === 'dark' ? 'btn-dark' : 'btn-white' }`" data-bs-toggle="modal" data-bs-target="#addAlbumModal">
							New album
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="container-fluid mt-n4">
			<div class="row">
				<div class="col">
					<Table :columns="table.columns" url="/api/albums" />
				</div>
			</div>
		</div>

		<ModalsAddAlbum />
	</div>
</template>

<script>
export default {
	components: {
		FolderOpenIcon: () => import('~/assets/icons/folder-open.svg?inline')
	},
	data({ $store }) {
		return {
			user: $store.state.auth.user,
			albums: [],
			table: {
				columns: [
					{
						label: 'Name',
						prop: 'name',
						cellOptions: {
							link: true
						}
					},
					{
						label: 'File Count',
						prop: 'fileCount'
					},
					{
						label: 'hidden',
						prop: 'hidden'
					},
					{
						label: 'NSFW',
						prop: 'nsfw'
					},
					{
						label: 'Created At',
						prop: 'createdAt'
					},
					{
						label: 'Modified At',
						prop: 'modifiedAt'
					}
				]
			}
		}
	}
}
</script>
