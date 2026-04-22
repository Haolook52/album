export interface Image {
  id: string
  title: string
  description: string
  filename: string
  originalName: string
  fileSize: number
  mimeType: string
  width: number
  height: number
  category: string
  tags: string[]
  uploadDate: string
  views: number
  likes: number
  downloadUrl: string
  thumbnailUrl: string
  optimizedUrl: string
}

export interface Category {
  id: string
  name: string
  description: string
  imageCount: number
  color: string
}

export interface UploadResponse {
  success: boolean
  image?: Image
  error?: string
}

export interface SearchFilters {
  category?: string
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
  sortBy: 'uploadDate' | 'views' | 'likes' | 'title'
  sortOrder: 'asc' | 'desc'
}

export interface SearchResult {
  images: Image[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminStats {
  totalImages: number
  totalCategories: number
  totalViews: number
  totalLikes: number
  storageUsed: number
  popularCategories: Category[]
  recentUploads: Image[]
}