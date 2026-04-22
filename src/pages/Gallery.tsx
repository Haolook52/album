import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, Grid, List, Eye, Heart } from 'lucide-react'
import { useImageStore } from '../store/imageStore'
import { SearchFilters } from '../types'

const Gallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [showFilters, setShowFilters] = useState(false)
  
  const { images, categories, searchResults, fetchImages, fetchCategories, searchImages, loading } = useImageStore()

  const displayedImages = searchResults ? searchResults.images : images
  const currentFilters: Partial<SearchFilters> = {
    category: selectedCategory || undefined
  }

  useEffect(() => {
    fetchCategories()
    
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    
    if (search) {
      searchImages(search, currentFilters)
    } else {
      fetchImages(currentFilters)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">图片库</h1>
          <p className="text-gray-600">
            {searchResults 
              ? `找到 ${searchResults.total} 张图片` 
              : `共 ${images.length} 张图片`
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索图片标题、描述或标签..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                <span>筛选</span>
              </button>
              <button
                type="submit"
                className="btn-primary px-6"
              >
                搜索
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">所有分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.imageCount})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    清除筛选
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* View Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Images Grid/List */}
        {!loading && displayedImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到图片</h3>
            <p className="text-gray-600">尝试调整搜索条件或上传新图片</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {displayedImages.map((image) => (
              <Link
                key={image.id}
                to={`/image/${image.id}`}
                className={`group ${
                  viewMode === 'grid' 
                    ? 'card hover:shadow-md transition-shadow duration-200'
                    : 'card hover:shadow-md transition-shadow duration-200 flex'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-200">
                      <img
                        src={image.thumbnailUrl || '/placeholder.jpg'}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{image.category}</span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{image.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{image.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={image.thumbnailUrl || '/placeholder.jpg'}
                        alt={image.title}
                        className="w-full h-full object-cover rounded-l-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{image.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">{image.category}</span>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{image.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{image.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {searchResults && searchResults.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: searchResults.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 rounded-lg ${
                    page === searchResults.page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery