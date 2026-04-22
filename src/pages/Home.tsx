import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Image, Search, Upload, TrendingUp } from 'lucide-react'
import { useImageStore } from '../store/imageStore'

const Home: React.FC = () => {
  const { images, categories, fetchImages, fetchCategories } = useImageStore()

  useEffect(() => {
    fetchImages({ pageSize: 8 })
    fetchCategories()
  }, [fetchImages, fetchCategories])

  const featuredCategories = categories.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              发现并分享
              <span className="text-primary-600"> 精彩图片</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              一个功能完整的图片分享平台，让您轻松上传、管理和分享高质量的图片作品。
              探索无限创意，发现视觉之美。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/gallery" className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3">
                <Search className="h-5 w-5" />
                <span>探索图库</span>
              </Link>
              <Link to="/upload" className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-3">
                <Upload className="h-5 w-5" />
                <span>上传图片</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              提供完整的图片分享解决方案，满足您的各种需求
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">轻松上传</h3>
              <p className="text-gray-600">
                支持多种图片格式，拖拽上传，批量处理，让您的作品快速上线
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">智能搜索</h3>
              <p className="text-gray-600">
                基于标签和分类的智能搜索系统，快速找到您需要的图片资源
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">性能优化</h3>
              <p className="text-gray-600">
                图片懒加载、CDN加速、响应式设计，确保最佳用户体验
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">热门分类</h2>
            <Link to="/gallery" className="text-primary-600 hover:text-primary-700 flex items-center space-x-1">
              <span>查看全部</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/gallery?category=${category.id}`}
                className="card p-4 text-center hover:shadow-md transition-shadow duration-200"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <Image className="h-6 w-6" style={{ color: category.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.imageCount} 张图片</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Images Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">最新图片</h2>
            <Link to="/gallery" className="text-primary-600 hover:text-primary-700 flex items-center space-x-1">
              <span>查看全部</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.slice(0, 8).map((image) => (
              <Link
                key={image.id}
                to={`/image/${image.id}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200"
              >
                <img
                  src={image.thumbnailUrl || '/placeholder.jpg'}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold text-sm truncate">{image.title}</h3>
                    <p className="text-xs opacity-90">{image.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好分享您的作品了吗？
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            立即加入我们，与全球创作者一起分享您的视觉故事
          </p>
          <Link to="/upload" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg inline-flex items-center space-x-2 transition-colors duration-200">
            <Upload className="h-5 w-5" />
            <span>开始上传</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home