import type { Album } from './album'

export interface File {
  readonly _id: string
  name: string
  url?: string
  readonly type: string
  readonly size: number
  albumId?: string
  album?: Album
  metadata: FileMetadata
  readonly createdAt: number
  readonly modifiedAt: number
}

export interface FileMetadata {
  height: number
  width: number
}
