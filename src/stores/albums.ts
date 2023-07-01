import type { Ref } from 'vue'
import type { Album, AlbumFile } from '@/types/album'

export const useAlbumsStore = defineStore('albums', () => {
  const albums: Ref<Album[]> = ref([])
  const count: Ref<number> = ref(0)
  const pages: Ref<number> = ref(0)
  const loading: Ref<boolean> = ref(false)

  const getAlbums = async (options?: { limit?: number, page?: number, setData?: boolean }) => {
    return await withLoadingState(loading, async () => {
      const { data: albumsD, count: countD, pages: pagesD } : { data: Album[], count: number, pages: number } = await useFaetch('/albums', { params: { limit: options?.limit, page: options?.page } })

      if (options?.setData) {
        albums.value = albumsD
        count.value = countD
        pages.value = pagesD
      }

      return { albums: albumsD, count: countD, pages: pagesD }
    })
  }

  const getAlbum = async (id: string) => {
    return await withLoadingState(loading, async () => {
      const data: Album = await useFaetch(`/albums/${id}`)

      return data
    })
  }

  const addAlbum = async (form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      const data: Album = await useFaetch('/albums', { baseURL: cdnBaseURL, method: 'post', body: form })
      albums.value.push(data)

      return albums
    })
  }

  const updateAlbum = async (id: string, form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      const data: Album = await useFaetch(`/albums/${id}`, { baseURL: cdnBaseURL, method: 'put', body: form })
      const index = albums.value.findIndex((album: any) => album.id === id)
      albums.value[index] = data

      return albums
    })
  }

  const publishAlbum = async (id: string) => {
    return await withLoadingState(loading, async () => {
      const data: Album = await useFaetch(`/albums/${id}/publish`, { method: 'post' })
      const index = albums.value.findIndex((album: any) => album.id === id)
      albums.value[index] = data

      return albums
    })
  }

  const unpublishAlbum = async (id: string) => {
    return await withLoadingState(loading, async () => {
      const data: Album = await useFaetch(`/albums/${id}/unpublish`, { method: 'post' })
      const index = albums.value.findIndex((album: any) => album.id === id)
      albums.value[index] = data

      return albums
    })
  }

  const deleteAlbum = async (id: string) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      await useFaetch(`/albums/${id}`, { baseURL: cdnBaseURL, method: 'delete' })
      const index = albums.value.findIndex((album: any) => album.id === id)
      albums.value.splice(index, 1)

      return albums
    })
  }

  const deleteAlbums = async (ids: string[]) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      await useFaetch('/albums', { baseURL: cdnBaseURL, method: 'delete', body: { ids } })
      albums.value = albums.value.filter((album: any) => !ids.includes(album.id))

      return albums
    })
  }

  const getAlbumFiles = async (id: string, limit = 25) => {
    return await withLoadingState(loading, async () => {
      const { data: images, count, pages }: { data: AlbumFile[], count: number, pages: number } = await useFaetch(`/albums/${id}/images`, { params: { limit } })

      return { images, count, pages }
    })
  }

  const addFiles = async (id: string, files: FormData) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      const data: Album['images'] = await useFaetch(`/albums/${id}/images`, { baseURL: cdnBaseURL, method: 'post', body: files })

      return data
    })
  }

  const deleteFile = async (id: string) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      await useFaetch(`/images/${id}`, { baseURL: cdnBaseURL, method: 'delete' })

      return albums
    })
  }

  const deleteFiles = async (ids: string[]) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      await useFaetch('/images', { baseURL: cdnBaseURL, method: 'delete', body: { ids } })

      return albums
    })
  }

  const updateFile = async (id: string, form: AlbumFile) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      const data: AlbumFile = await useFaetch(`/images/${id}`, { baseURL: cdnBaseURL, method: 'put', body: form })

      return data
    })
  }

  const getFile = async (id: string, options: { includeAlbum: boolean } = { includeAlbum: false }) => {
    return await withLoadingState(loading, async () => {
      const data: AlbumFile = await useFaetch(`/images/${id}`, { params: { includeAlbum: options.includeAlbum } })

      return data
    })
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
