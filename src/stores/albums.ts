import type { Ref } from 'vue'

export interface AlbumFile {
	url: string
	readonly id: string
	name: string
	readonly type: string
	readonly size: number
	albumId: string
	album?: object
	readonly createdAt: string
	readonly updatedAt: string
}

export interface Album {
	readonly id: string
	name: string
	hidden: boolean
	nsfw: boolean
	favorite: boolean
	featured: boolean
	readonly createdAt: string
	readonly updatedAt: string
	fileCount: number
	images: AlbumFile[]
}

export const useAlbumsStore = defineStore('albums', () => {
	const	albums: Ref<Album[]> = ref([])
	const count: Ref<number> = ref(0)
	const pages: Ref<number> = ref(0)
	const	loading: Ref<boolean> = ref(false)

	const	getAlbums = async (options?: { limit: number, page: number, setData: boolean }) => {
		try {
			loading.value = true
			const { data: albumsD, count: countD, pages: pagesD } : { data: Album[], count: number, pages: number } = await useFaetch('/albums', { params: { limit: options?.limit, page: options?.page } })

			if (options?.setData) {
				albums.value = albumsD
				count.value = countD
				pages.value = pagesD
			}

			loading.value = false

			return { data: { albums: albumsD, count: countD, pages: pagesD }, error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
	}

	const	getAlbum = async (id: string) => {
		try {
			loading.value = true
			const data: Album = await useFaetch(`/albums/${id}`)
			loading.value = false

			return { data, error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
	}

	const	addAlbum = async (form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
		try {
			const data: Album = await useFaetch('/albums', { method: 'post', body: form })
			albums.value.push(data)

			return { data, error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
	}

	const	updateAlbum = async (id: string, form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
		try {
			const data: Album = await useFaetch(`/albums/${id}`, { method: 'put', body: form })
			const index = albums.value.findIndex((album: any) => album.id === id)
			albums.value[index] = data

			return { data, error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
	}

	const	deleteAlbum = async (id: string) => {
		try {
			await useFaetch(`/albums/${id}`, { method: 'delete' })
			const index = albums.value.findIndex((album: any) => album.id === id)
			albums.value.splice(index, 1)

			return { error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
	}

	const getAlbumFiles = async (id: string, limit = 25) => {
		const { images }: { images: { data: AlbumFile[], count: number, pages: number } } = await useFaetch(`/albums/${id}?includeImages=true`, { params: { limit } })
		images.data = images.data.map((image: any) => {
			image.url = `/albums/${id}/files/${image.id}`
			return image
		})

		return { images: images.data, count: images.count, pages: images.pages }
	}

	const	addFiles = async (id: string, files: File[]) => {
		try {
			const data: Album['images'] = await useFaetch(`/albums/${id}/files`, { method: 'post', body: { files } })

			return { data, error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
	}

	const	deleteFile = async (id: string) => {
		try {
			await useFaetch(`/images/${id}`, { method: 'delete' })

			return { error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
	}

	const	updateFile = async (id: string, form: AlbumFile) => {
		try {
			const data: AlbumFile = await useFaetch(`/images/${id}`, { method: 'put', body: form })

			return { data, error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
	}

	const	getFile = async (id: string) => {
		try {
			const data: AlbumFile = await useFaetch(`/images/${id}`)

			return { data, error: null }
		} catch (e: any) {
			return { error: e.data ? e.data.error : e }
		}
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
		deleteFile,
		updateFile,
		getFile
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAlbumsStore, import.meta.hot))
}
