import type { Ref } from 'vue'
import type { Album, AlbumFile } from '@/types/Album'

export const useAlbumsStore = defineStore('albums', () => {
  const albums: Ref<Album[]> = ref([])
  const count: Ref<number> = ref(0)
  const pages: Ref<number> = ref(0)
  const loading: Ref<boolean> = ref(false)

  const getAlbums = async (options?: { limit?: number, page?: number, setData?: boolean }) => {
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

  const getAlbum = async (id: string) => {
    try {
      loading.value = true
      const data: Album = await useFaetch(`/albums/${id}`)
      loading.value = false

      return { data, error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const addAlbum = async (form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
    try {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      const data: Album = await useFaetch('/albums', { baseURL: cdnBaseURL, method: 'post', body: form })
      albums.value.push(data)

      return { data, error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const updateAlbum = async (id: string, form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
    try {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      const data: Album = await useFaetch(`/albums/${id}`, { baseURL: cdnBaseURL, method: 'put', body: form })
      const index = albums.value.findIndex((album: any) => album.id === id)
      albums.value[index] = data

      return { data, error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const deleteAlbum = async (id: string) => {
    try {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      await useFaetch(`/albums/${id}`, { baseURL: cdnBaseURL, method: 'delete' })
      const index = albums.value.findIndex((album: any) => album.id === id)
      albums.value.splice(index, 1)

      return { error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const deleteAlbums = async (ids: string[]) => {
    try {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      await useFaetch('/albums', { baseURL: cdnBaseURL, method: 'delete', body: { ids } })
      albums.value = albums.value.filter((album: any) => !ids.includes(album.id))

      return { error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const getAlbumFiles = async (id: string, limit = 25) => {
    try {
      loading.value = true
      const { data: images, count, pages }: { data: AlbumFile[], count: number, pages: number } = await useFaetch(`/albums/${id}/images`, { params: { limit } })

      return { data: { images, count, pages }, error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const addFiles = async (id: string, files: FormData) => {
    try {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      const data: Album['images'] = await useFaetch(`/albums/${id}/images/save`, { baseURL: cdnBaseURL, headers: {
        'Content-Type': 'application/json'
      }, method: 'post', body: files })

      return { data, error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const deleteFile = async (id: string) => {
    try {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      await useFaetch(`/images/${id}`, { baseURL: cdnBaseURL, method: 'delete' })

      return { error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const deleteFiles = async (ids: string[]) => {
    try {
      const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL
      await useFaetch('/images', { baseURL: cdnBaseURL, method: 'delete', body: { ids } })

      return { error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const updateFile = async (id: string, form: AlbumFile) => {
    try {
      const data: AlbumFile = await useFaetch(`/images/${id}`, { method: 'put', body: form })

      return { data, error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const getFile = async (id: string, options: { includeAlbum: boolean } = { includeAlbum: false }) => {
    try {
      const data: AlbumFile = await useFaetch(`/images/${id}`, { params: { includeAlbum: options.includeAlbum } })

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
