import React, { useEffect, useState } from 'react'
import { BarChart, PieChart, Users, Image, Database, TrendingUp, Download, Upload } from 'lucide-react'

interface AdminStats {
  totalImages: number
  totalCategories: number
  totalViews: number
  totalLikes: number
  storageUsed: number
  popularCategories: Array<{
    id: string
    name: string
    imageCount: number
    color: string
  }>
  recentUploads: Array<{
    id: string
    title: string
    uploadDate: string
    views: number
    likes: number
  }>
}

const Admin: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'images' | 'categories' | 'users'>('overview')

  useEffect(() => {
    // 模拟获取统计数据
    const mockStats: AdminStats = {
      totalImages: 156,
      totalCategories: 6,
      totalViews: 12450,
      totalLikes: 2896,
      storageUsed: 245.6,
      popularCategories: [
        { id: 'nature', name: '自然风光', imageCount: 45, color: '#10b981' },
        { id: 'architecture', name: '建筑', imageCount: 32, color: '#3b82f6' },
        { id: 'portrait', name: '人像', imageCount: 28, color: '#8b5cf6' },
        { id: 'food', name: '美食', imageCount: 25, color: '#f59e0b' },
        { id: 'travel', name: '旅行', imageCount: 18, color: '#ef4444' }
      ],
      recentUploads: [
        { id: '1', title: '山间日出', uploadDate: '2024-01-15', views: 156, likes: 34 },
        { id: '2', title: '城市夜景', uploadDate: '2024-01-14', views: 89, likes: 21 },
        { id: '3', title: '美食摄影', uploadDate: '2024-01-13', views: 234, likes: 67 },
        { id: '4', title: '人像写真', uploadDate: '2024-01-12', views: 178, likes: 45 },
        { id: '5', title: '自然风光', uploadDate: '2024-01-11', views: 312, likes: 89 }
      ]
    }
    
    setStats(mockStats)
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理后台</h1>
          <p className="text-gray-600">监控和管理您的图片分享平台</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: '概览', icon: BarChart },
              { id: 'images', label: '图片管理', icon: Image },
              { id: 'categories', label: '分类管理', icon: Database },
              { id: 'users', label: '用户管理', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Image className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总图片数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">分类数量</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总浏览量</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Download className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">存储使用</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.storageUsed} MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Categories Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">热门分类</h3>
              <div className="space-y-3">
                {stats.popularCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{category.imageCount} 张</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${(category.imageCount / stats.totalImages) * 100}%`,
                            backgroundColor: category.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最近上传</h3>
              <div className="space-y-4">
                {stats.recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{upload.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(upload.uploadDate).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{upload.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Upload className="h-4 w-4" />
                        <span>{upload.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Image className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-gray-900">批量上传</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Database className="h-6 w-6 text-green-600" />
                <span className="font-medium text-gray-900">管理分类</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart className="h-6 w-6 text-purple-600" />
                <span className="font-medium text-gray-900">查看报表</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin