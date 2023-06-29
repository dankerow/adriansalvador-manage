export interface Column {
  prop: string
  label: string
  sortable?: boolean
  width?: number
}

export interface Row {
  id: string
  [key: string]: any
}

export interface PaginationOptions {
  lengthMenu?: number[]
  count?: number
  pages?: number
}

export interface FilterOptions {
  search?: string
  limit?: number
  sort?: {
    by?: string
    order?: string
  }
}

export interface Props {
  title?: string
  columns: Column[]
  selection?: boolean
  multipleSelection?: boolean
  stickyHeader?: boolean
  height?: string
  loading?: boolean
  data: Row[]
  pagination?: PaginationOptions
  filters?: FilterOptions
  buttons?: {
    name: string
    text: string
    icon?: string
    url?: string
    disabled?: boolean
    callback?:() => void
  }[],
  download?: {
    excel?: boolean
    csv?: boolean
    pdf?: boolean
  }
  show?: {
    pagination?: boolean
  }
}
