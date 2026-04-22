import express from 'express'
import { getImages, getImageById, likeImage, getCategories } from '../database.js'

const router = express.Router()

// 获取图片列表
router.post('/', async (req, res) => {
  try {
    const { filters = {} } = req.body
    const images = await getImages(filters)
    res.json({ images })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 获取单个图片详情
router.get('/:id', async (req, res) => {
  try {
    const image = await getImageById(req.params.id)
    if (!image) {
      return res.status(404).json({ error: '图片未找到' })
    }
    res.json({ image })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 点赞图片
router.post('/:id/like', async (req, res) => {
  try {
    await likeImage(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 获取分类列表
router.get('/categories', async (req, res) => {
  try {
    const categories = await getCategories()
    res.json({ categories })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router