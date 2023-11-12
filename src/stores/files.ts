import type { Ref } from 'vue'
import type { Album, AlbumFile } from '@/types'

export const useFilesStore = defineStore('files', () => {
  const files: Ref<AlbumFile[]> = ref([])
  const count: Ref<number> = ref(0)
  const pages: Ref<number> = ref(0)
  const loading: Ref<boolean> = ref(false)

  const getFiles = async (options?: { limit?: number, page?: number, setData?: boolean }) => {
    return await withLoadingState(loading, async () => {
      const { data: filesD, count: countD, pages: pagesD } : { data: AlbumFile[], count: number, pages: number } = await useFaetch('/files', { params: { limit: options?.limit, page: options?.page } })

      if (options?.setData) {
        files.value = filesD
        count.value = countD
        pages.value = pagesD
      }

      return { files: filesD, count: countD, pages: pagesD }
    })
  }

  const getFile = async (id: string, options: { includeAlbum: boolean } = { includeAlbum: false }) => {
    return await withLoadingState(loading, async () => {
      const data: AlbumFile = await useFaetch(`/files/${id}`, { params: { includeAlbum: options.includeAlbum } })

      return data
    })
  }

  const addFile = async (form: { name: string, nsfw: boolean, hidden: boolean, favorite: boolean, featured: boolean }) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl
      const data: AlbumFile = await useFaetch('/files', { baseURL: cdnBaseUrl, method: 'post', body: form })
      files.value.push(data)

      return files
    })
  }

  const addFiles = async (id: string, files: FormData) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl
      const data: Album['images'] = await useFaetch(`/albums/${id}/files`, { baseURL: cdnBaseUrl, method: 'post', body: files })

      return data
    })
  }

  const deleteFile = async (id: string) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl
      await useFaetch(`/files/${id}`, { baseURL: cdnBaseUrl, method: 'delete' })

      return files
    })
  }

  const deleteFiles = async (ids: string[]) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl
      await useFaetch('/files', { baseURL: cdnBaseUrl, method: 'delete', body: { ids } })

      return files
    })
  }

  const updateFile = async (id: string, form: AlbumFile) => {
    return await withLoadingState(loading, async () => {
      const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl
      const data: AlbumFile = await useFaetch(`/files/${id}`, { baseURL: cdnBaseUrl, method: 'put', body: form })

      return data
    })
  }

  return {
    files,
    count,
    pages,
    loading,
    getFiles,
    getFile,
    addFile,
    updateFile,
    addFiles,
    deleteFile,
    deleteFiles,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFilesStore, import.meta.hot))
}
