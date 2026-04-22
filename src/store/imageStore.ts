import { create } from 'zustand'
import { Image, Category, SearchFilters, SearchResult } from '../types'

interface ImageState {
  images: Image[]
  categories: Category[]
  searchResults: SearchResult | null
  selectedImage: Image | null
  loading: boolean
  error: string | null
  
  // Actions
  setImages: (images: Image[]) => void
  setCategories: (categories: Category[]) => void
  setSearchResults: (results: SearchResult) => void
  setSelectedImage: (image: Image | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Async actions
  fetchImages: (filters?: Partial<SearchFilters>) => Promise<void>
  fetchCategories: () => Promise<void>
  searchImages: (query: string, filters?: Partial<SearchFilters>) => Promise<void>
  uploadImage: (file: File, title: string, description: string, category: string, tags: string[]) => Promise<void>
  likeImage: (imageId: string) => Promise<void>
}

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  categories: [],
  searchResults: null,
  selectedImage: null,
  loading: false,
  error: null,

  setImages: (images) => set({ images }),
  setCategories: (categories) => set({ categories }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setSelectedImage: (selectedImage) => set({ selectedImage }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchImages: async (filters = {}) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters })
      })
      
      if (!response.ok) throw new Error('Failed to fetch images')
      
      const data = await response.json()
      set({ images: data.images, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      
      const data = await response.json()
      set({ categories: data.categories })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  searchImages: async (query, filters = {}) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters })
      })
      
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      set({ searchResults: data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  uploadImage: async (file, title, description, category, tags) => {
    set({ loading: true, error: null })
    
    const formData = new FormData()
    formData.append('image', file)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('tags', JSON.stringify(tags))

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
      
      const data = await response.json()
      
      // Add the new image to the current list
      const { images } = get()
      set({ 
        images: [data.image, ...images],
        loading: false 
      })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  likeImage: async (imageId) => {
    try {
      const response = await fetch(`/api/images/${imageId}/like`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Like failed')
      
      // Update the image in the store
      const { images } = get()
      const updatedImages = images.map(img => 
        img.id === imageId ? { ...img, likes: img.likes + 1 } : img
      )
      
      set({ images: updatedImages })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  }
}))