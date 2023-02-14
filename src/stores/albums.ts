import { defineStore } from 'pinia'
import type { Ref } from 'vue'

interface AlbumFile {
	id: string
	name: string
	size: number
	albumId: string
	createdAt: string
	updatedAt: string
}

export interface Album {
	id: string
	name: string
	nsfw: boolean
	createdAt: string
	updatedAt: string
	fileCount: number
	images: AlbumFile[]
}

interface AlbumState {
	albums: (Album)[]
	count: number
	pages: number
}

export const useAlbumsStore = defineStore('albums', () => {
	const	albums: Ref<AlbumState['albums']> = ref([])
	const count: Ref<AlbumState['count']> = ref(0)
	const pages: Ref<AlbumState['pages']> = ref(0)
	const	loading: Ref<boolean> = ref(false)

	const	getAlbums = async () => {
		loading.value = true
		const { data: albumsD, count: countD, pages: pagesD } : { data: AlbumState['albums'], count: AlbumState['count'], pages: AlbumState['pages'] } = await useFaetch('/albums')

		albums.value = albumsD
		count.value = countD
		pages.value = pagesD
		loading.value = false
	}

	const	getAlbum = async (id: string) => {
		loading.value = true
		const data: Album = await useFaetch(`/albums/${id}`)
		loading.value = false
		return data
	}

	const	addAlbum = async (name: string, nsfw: boolean, hidden: boolean) => {
		const data: Album = await useFaetch('/albums', { method: 'post', body: { name, nsfw, hidden } })
		albums.value.push(data)

		return data
	}

	const	updateAlbum = async (id: string, name: string, nsfw: boolean, hidden: boolean) => {
		const data: Album = await useFaetch(`/albums/${id}`, { method: 'put', body: { name, nsfw, hidden } })
		const index = albums.value.findIndex((album: any) => album.id === id)
		albums.value[index] = data

		return data
	}

	const	deleteAlbum = async (id: string) => {
		await useFaetch(`/albums/${id}`, { method: 'delete' })
		const index = albums.value.findIndex((album: any) => album.id === id)
		albums.value.splice(index, 1)
	}

	const getAlbumFiles = async (id: string, limit = 25) => {
		const { images }: { images: AlbumFile[] } = await useFaetch(`/albums/${id}?includeImages=true`, { params: { limit } })
		return images
	}

	const	addFiles = async (id: string, files: File[]) => {
		const data: Album['images'] = await useFaetch(`/albums/${id}/files`, { method: 'post', body: { files } })
		const index = albums.value.findIndex((album: any) => album.id === id)
		albums.value[index].images = data

		return data
	}

	const	removeFile = async (id: string, fileId: string) => {
		await useFaetch(`/albums/${id}/files/${fileId}`, { method: 'delete' })
		const index = albums.value.findIndex((album: any) => album.id === id)
		const fileIndex = albums.value[index].images.findIndex((file: any) => file.id === fileId)
		albums.value[index].images.splice(fileIndex, 1)
	}

	const	updateFile = async (id: string, fileId: string, name: string, nsfw: boolean, hidden: boolean) => {
		const data: AlbumFile = await useFaetch(`/albums/${id}/files/${fileId}`, { method: 'put', body: { name, nsfw, hidden } })
		const index = albums.value.findIndex((album: any) => album.id === id)
		const fileIndex = albums.value[index].images.findIndex((file: any) => file.id === fileId)
		albums.value[index].images[fileIndex] = data

		return data
	}

	const	getFile = async (id: string, fileId: string) => {
		const data: AlbumFile = await useFaetch(`/albums/${id}/files/${fileId}`)
		return data
	}

	return {
		albums,
		count,
		pages,
		loading,
		getAlbums,
		getAlbum,
		addAlbum,
		updateAlbum,
		deleteAlbum,
		getAlbumFiles,
		addFiles,
		removeFile,
		updateFile,
		getFile
	}
})
