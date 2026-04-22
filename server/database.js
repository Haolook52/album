import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'images.db')
const db = new sqlite3.Database(dbPath)

// Promisify database methods
const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const dbAll = promisify(db.all.bind(db))

// Initialize database
db.serialize(() => {
  // 创建图片表
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    category TEXT NOT NULL,
    tags TEXT,
    upload_date TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    download_url TEXT,
    thumbnail_url TEXT,
    optimized_url TEXT
  )`)

  // 创建分类表
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    image_count INTEGER DEFAULT 0
  )`)

  // 插入示例分类
  const categories = [
    { id: 'nature', name: '自然风光', description: '美丽的自然景观', color: '#10b981' },
    { id: 'architecture', name: '建筑', description: '现代与古典建筑', color: '#3b82f6' },
    { id: 'portrait', name: '人像', description: '人物肖像摄影', color: '#8b5cf6' },
    { id: 'food', name: '美食', description: '美味食物摄影', color: '#f59e0b' },
    { id: 'travel', name: '旅行', description: '旅行摄影', color: '#ef4444' },
    { id: 'abstract', name: '抽象', description: '抽象艺术摄影', color: '#ec4899' }
  ]

  categories.forEach(cat => {
    db.run(`INSERT OR IGNORE INTO categories (id, name, description, color) VALUES (?, ?, ?, ?)`,
      [cat.id, cat.name, cat.description, cat.color])
  })

  // 插入示例图片数据
  const sampleImages = [
    {
      id: '1',
      title: '山间日出',
      description: '美丽的山间日出景色',
      filename: 'sunrise.jpg',
      original_name: 'sunrise.jpg',
      file_size: 2048000,
      mime_type: 'image/jpeg',
      width: 1920,
      height: 1080,
      category: 'nature',
      tags: JSON.stringify(['日出', '山脉', '自然']),
      upload_date: new Date().toISOString(),
      views: 0,
      likes: 0,
      download_url: '/images/sunrise.jpg',
      thumbnail_url: '/images/thumbnails/sunrise.jpg',
      optimized_url: '/images/optimized/sunrise.jpg'
    }
  ]

  sampleImages.forEach(img => {
    db.run(`INSERT OR IGNORE INTO images VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [img.id, img.title, img.description, img.filename, img.original_name, 
       img.file_size, img.mime_type, img.width, img.height, img.category,
       img.tags, img.upload_date, img.views, img.likes, img.download_url,
       img.thumbnail_url, img.optimized_url])
  })
})

// 获取图片列表
export async function getImages(filters = {}) {
  let query = 'SELECT * FROM images'
  let params = []
  
  const conditions = []
  
  if (filters.category) {
    conditions.push('category = ?')
    params.push(filters.category)
  }
  
  if (filters.tags && filters.tags.length > 0) {
    conditions.push('tags LIKE ?')
    params.push(`%${filters.tags[0]}%`)
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }
  
  // 排序
  const sortBy = filters.sortBy || 'upload_date'
  const sortOrder = filters.sortOrder || 'desc'
  query += ` ORDER BY ${sortBy} ${sortOrder}`
  
  // 分页
  const page = filters.page || 1
  const pageSize = filters.pageSize || 12
  const offset = (page - 1) * pageSize
  query += ' LIMIT ? OFFSET ?'
  params.push(pageSize, offset)
  
  const images = await dbAll(query, params)
  
  // 转换tags为数组
  return images.map(img => ({
    ...img,
    tags: img.tags ? JSON.parse(img.tags) : []
  }))
}

// 获取单个图片
export async function getImageById(id) {
  const image = await dbGet('SELECT * FROM images WHERE id = ?', [id])
  if (image) {
    image.tags = image.tags ? JSON.parse(image.tags) : []
  }
  return image
}

// 点赞图片
export async function likeImage(id) {
  await dbRun('UPDATE images SET likes = likes + 1 WHERE id = ?', [id])
}

// 获取分类列表
export async function getCategories() {
  const categories = await dbAll('SELECT * FROM categories')
  
  // 获取每个分类的图片数量
  for (let category of categories) {
    const count = await dbGet('SELECT COUNT(*) as count FROM images WHERE category = ?', [category.id])
    category.imageCount = count.count
  }
  
  return categories
}

// 搜索图片
export async function searchImages(query, filters = {}) {
  let searchQuery = `SELECT * FROM images 
    WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?`
  
  let params = [`%${query}%`, `%${query}%`, `%${query}%`]
  
  if (filters.category) {
    searchQuery += ' AND category = ?'
    params.push(filters.category)
  }
  
  const sortBy = filters.sortBy || 'upload_date'
  const sortOrder = filters.sortOrder || 'desc'
  searchQuery += ` ORDER BY ${sortBy} ${sortOrder}`
  
  const images = await dbAll(searchQuery, params)
  
  return images.map(img => ({
    ...img,
    tags: img.tags ? JSON.parse(img.tags) : []
  }))
}

// 插入新图片
export async function insertImage(imageData) {
  const {
    id, title, description, filename, originalName, fileSize, mimeType,
    width, height, category, tags, downloadUrl, thumbnailUrl, optimizedUrl
  } = imageData
  
  await dbRun(`INSERT INTO images VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, description, filename, originalName, fileSize, mimeType,
     width, height, category, JSON.stringify(tags), new Date().toISOString(),
     0, 0, downloadUrl, thumbnailUrl, optimizedUrl])
  
  return getImageById(id)
}

// 获取管理统计信息
export async function getAdminStats() {
  const totalImages = await dbGet('SELECT COUNT(*) as count FROM images')
  const totalCategories = await dbGet('SELECT COUNT(*) as count FROM categories')
  const totalViews = await dbGet('SELECT SUM(views) as total FROM images')
  const totalLikes = await dbGet('SELECT SUM(likes) as total FROM images')
  const storageUsed = await dbGet('SELECT SUM(file_size) as total FROM images')
  
  const popularCategories = await dbAll(`
    SELECT c.*, COUNT(i.id) as imageCount 
    FROM categories c 
    LEFT JOIN images i ON c.id = i.category 
    GROUP BY c.id 
    ORDER BY imageCount DESC 
    LIMIT 5
  `)
  
  const recentUploads = await dbAll('SELECT * FROM images ORDER BY upload_date DESC LIMIT 5')
  
  return {
    totalImages: totalImages.count,
    totalCategories: totalCategories.count,
    totalViews: totalViews.total || 0,
    totalLikes: totalLikes.total || 0,
    storageUsed: storageUsed.total || 0,
    popularCategories: popularCategories.map(cat => ({
      ...cat,
      imageCount: parseInt(cat.imageCount)
    })),
    recentUploads: recentUploads.map(img => ({
      ...img,
      tags: img.tags ? JSON.parse(img.tags) : []
    }))
  }
}

export default db