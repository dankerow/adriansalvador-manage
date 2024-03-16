import type { Album, AlbumFile } from '@/types/album'

export const useAlbumsStore = defineStore('albums', () => {
  const albums = ref<Album[]>([])
  const count = ref<number>(0)
  const pages = ref<number>(0)

  const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl

  const isPopulated = computed(() => albums.value.length > 0)

  const getAlbums = async (params?: { status?: string, search?: string, limit?: number, page?: number }, options?: { setData?: boolean }) => {
    const { data: albumsD, count: countD, pages: pagesD } = await useFaetch<{ data: Album[], count: number, pages: number }>('/albums', {
      params: {
        status: params?.status ?? 'all',
        ...params
      }
    })

    if (options?.setData) {
      albums.value = albumsD
      count.value = countD
      pages.value = pagesD
    }

    return { albums: albumsD, count: countD, pages: pagesD }
  }

  const getAlbum = async (id: string) => {
    const data = await useFaetch<Album>(`/albums/${id}`)

    return data
  }

  const addAlbum = async (form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
    const data  = await useFaetch<Album>('/albums', {
      baseURL: cdnBaseUrl,
      method: 'post',
      body: form
    })

    albums.value.push(data)

    return albums
  }

  const updateAlbum = async (id: string, form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
    const data = await useFaetch<Album>(`/albums/${id}`, {
      baseURL: cdnBaseUrl,
      method: 'put',
      body: form
    })
    const index = albums.value.findIndex((album: any) => album.id === id)

    albums.value[index] = data

    return albums
  }

  const publishAlbum = async (id: string) => {
    const data = await useFaetch<Album>(`/albums/${id}/publish`, {
      method: 'post'
    })
    const index = albums.value.findIndex((album: any) => album.id === id)

    albums.value[index] = data

    return albums
  }

  const unpublishAlbum = async (id: string) => {
    const data = await useFaetch<Album>(`/albums/${id}/unpublish`, {
      method: 'post'
    })
    const index = albums.value.findIndex((album: any) => album.id === id)

    albums.value[index] = data

    return albums
  }

  const deleteAlbum = async (id: string) => {
    await useFaetch(`/albums/${id}`, {
      baseURL: cdnBaseUrl,
      method: 'delete'
    })

    const index = albums.value.findIndex((album: any) => album.id === id)

    albums.value.splice(index, 1)

    return albums
  }

  const deleteAlbums = async (ids: string[]) => {
    await useFaetch('/albums', {
      baseURL: cdnBaseUrl,
      method: 'delete',
      body: { ids }
    })

    albums.value = albums.value.filter((album: any) => !ids.includes(album.id))

    return albums
  }

  const getAlbumFiles = async (id: string, limit = 25) => {
    const { data: images, count, pages } = await useFaetch<{ data: AlbumFile[], count: number, pages: number }>(`/albums/${id}/files`, {
      params: { limit }
    })

    return { images, count, pages }
  }

  const addFiles = async (id: string, files: FormData) => {
    const data = await useFaetch<Album['images']>(`/albums/${id}/files`, {
      baseURL: cdnBaseUrl,
      method: 'post',
      body: files
    })

    return data
  }

  const deleteFile = async (id: string) => {
    await useFaetch(`/files/${id}`, {
      baseURL: cdnBaseUrl,
      method: 'delete'
    })

    return albums
  }

  const deleteFiles = async (ids: string[]) => {
    await useFaetch('/files', {
      baseURL: cdnBaseUrl,
      method: 'delete',
      body: { ids }
    })

    return albums
  }

  const updateFile = async (id: string, form: AlbumFile) => {
    const data = await useFaetch<AlbumFile>(`/files/${id}`, {
      baseURL: cdnBaseUrl,
      method: 'put',
      body: form
    })

    return data
  }

  const getFile = async (id: string, options: { includeAlbum: boolean } = { includeAlbum: false }) => {
    const data = await useFaetch<AlbumFile>(`/files/${id}`, {
      params: {
        includeAlbum: options.includeAlbum
      }
    })

    return data
  }

  return {
    albums,
    count,
    pages,
    isPopulated,
    getAlbums,
    getAlbum,
    addAlbum,
    updateAlbum,
    publishAlbum,
    unpublishAlbum,
    deleteAlbum,
    deleteAlbums,
    getAlbumFiles,
    addFiles,
    deleteFile,
    deleteFiles,
    updateFile,
    getFile
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlbumsStore, import.meta.hot))
}
