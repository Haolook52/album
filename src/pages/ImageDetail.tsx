import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Eye, Heart, Download, Calendar, Tag } from 'lucide-react'
import { useImageStore } from '../store/imageStore'

const ImageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { selectedImage, setSelectedImage, likeImage, fetchImages } = useImageStore()

  useEffect(() => {
    if (id) {
      // 在实际应用中，这里应该调用API获取单个图片详情
      // 现在我们先从现有图片中查找
      fetchImages().then(() => {
        const image = useImageStore.getState().images.find(img => img.id === id)
        setSelectedImage(image || null)
      })
    }
  }, [id, setSelectedImage, fetchImages])

  const handleLike = () => {
    if (selectedImage) {
      likeImage(selectedImage.id)
    }
  }

  const handleDownload = () => {
    if (selectedImage?.downloadUrl) {
      const link = document.createElement('a')
      link.href = selectedImage.downloadUrl
      link.download = selectedImage.originalName
      link.click()
    }
  }

  if (!selectedImage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">图片未找到</h2>
          <Link to="/gallery" className="text-primary-600 hover:text-primary-700">
            返回图库
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/gallery" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回图库</span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={selectedImage.optimizedUrl || selectedImage.downloadUrl || '/placeholder.jpg'}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              </div>
            </div>

            {/* Info Panel */}
            <div className="p-6 lg:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h1>
              
              {selectedImage.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">{selectedImage.description}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Eye className="h-5 w-5" />
                  <span>{selectedImage.views} 次浏览</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Heart className="h-5 w-5" />
                  <span>{selectedImage.likes} 个赞</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(selectedImage.uploadDate).toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Tag className="h-5 w-5" />
                  <span>{selectedImage.category}</span>
                </div>
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">文件信息</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>文件名:</span>
                    <span>{selectedImage.originalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>文件大小:</span>
                    <span>{(selectedImage.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>分辨率:</span>
                    <span>{selectedImage.width} × {selectedImage.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>格式:</span>
                    <span>{selectedImage.mimeType.split('/')[1]?.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleLike}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>点赞 ({selectedImage.likes})</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center space-x-2 btn-primary"
                >
                  <Download className="h-5 w-5" />
                  <span>下载</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Images */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">相关图片</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 这里可以显示同分类的其他图片 */}
            <div className="text-center py-8 text-gray-500">
              相关图片功能待实现
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageDetail