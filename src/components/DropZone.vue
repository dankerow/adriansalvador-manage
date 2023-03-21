<script setup lang="ts">
import { useDropZone } from '@vueuse/core'

const colorMode = useColorMode()

const filesData = ref<{ name: string; size: number; type: string; lastModified: number, preview: string }[]>([])
const filesDataTransfer = ref<DataTransfer>(new DataTransfer())

const onDrop = (files: File[] | null) => {
	if (files) {
		filesData.value.push(...files.map((file) => {
			filesDataTransfer.value.items.add(file)

			return {
				name: file.name,
				size: file.size,
				type: file.type,
				lastModified: file.lastModified,
				preview: URL.createObjectURL(file)
			}
		}))

		const input = document.getElementById('formFileSm') as HTMLInputElement
		input.files = filesDataTransfer.value.files
	}
}
const dropZoneRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

const onImageInputChange = (e: Event) => {
	const files = (e.target as HTMLInputElement).files
	if (files) {
		onDrop(Array.from(files))
	}
}

const removeFile = (index: number) => {
	const file = filesData.value[index]

	URL.revokeObjectURL(file.preview)

	filesDataTransfer.value.items.remove(index)
	filesData.value.splice(index, 1)

	const input = document.getElementById('selectFiles') as HTMLInputElement
	input.files = filesDataTransfer.value.files
}

const fileTypes = [
	'image/apng',
	'image/jpeg',
	'image/pjpeg',
	'image/png',
	'image/webp'
]

const validFileType = (file: File) => {
	return fileTypes.includes(file.type)
}

const fileSize = (number: number) => {
	if (number < 1024) {
		return `${number} bytes`
	} else if (number >= 1024 && number < 1048576) {
		return `${(number / 1024).toFixed(1)} KB`
	} else if (number >= 1048576) {
		return `${(number / 1048576).toFixed(1)} MB`
	}
}

onUnmounted(() => {
	filesData.value.forEach(file => URL.revokeObjectURL(file.preview))
})
</script>

<template>
	<div class="d-flex">
		<div class="w-100 h-auto position-relative">
			<div
				ref="dropZoneRef"
				class="dropzone d-flex flex-column w-100 h-auto justify-content-center align-items-center p-4 bg-dark rounded border-1 border-secondary"
				:class="{ 'border-success': isOverDropZone }"
			>
				<div class="text-center">
					<label for="selectFiles" class="form-label">Drop your images here</label>
					<input id="selectFiles" class="form-control form-control-sm" type="file" accept="image/*" multiple @change.prevent="onImageInputChange">
				</div>
			</div>

			<div class="preview">
				<div class="row row-cols-1 row-cols-lg-4 mt-4">
					<div v-for="(file, index) in filesData" :key="index" class="col">
						<div class="card" :class="{ 'bg-darker': colorMode.value === 'dark' }">
							<div class="card-header">
								<h2 class="h3 mb-0 text-truncate">
									{{ file.name }}
								</h2>
							</div>

							<div class="card-body">
								<p>Size: {{ fileSize(file.size) }}</p>
								<p>Type: {{ file.type }}</p>

								<img :src="file.preview" alt="image" class="img-fluid">
							</div>

							<div class="card-footer text-muted">
								<p class="mb-0">
									Last modified: {{ file.lastModified }}
								</p>

								<button class="btn btn-danger btn-sm" @click.prevent="removeFile(index)">
									Remove
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.dropzone {
	border-style: dashed;
	transition: border-color 0.3s ease-in-out;
}
</style>
