import express from 'express'
import { searchImages } from '../database.js'

const router = express.Router()

// 搜索图片
router.post('/', async (req, res) => {
  try {
    const { query = '', filters = {}, page = 1, pageSize = 12 } = req.body
    
    if (!query.trim()) {
      return res.status(400).json({ error: '搜索关键词不能为空' })
    }
    
    const allImages = await searchImages(query, filters)
    
    // 手动分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedImages = allImages.slice(startIndex, endIndex)
    
    const result = {
      images: paginatedImages,
      total: allImages.length,
      page,
      pageSize,
      totalPages: Math.ceil(allImages.length / pageSize)
    }
    
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router