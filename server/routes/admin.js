import express from 'express'
import { getAdminStats } from '../database.js'

const router = express.Router()

// 获取管理统计信息
router.get('/stats', async (req, res) => {
  try {
    const stats = await getAdminStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router