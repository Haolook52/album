import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { insertImage } from '../database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB限制
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'), false)
    }
  }
})

// 图片上传接口
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要上传的图片' })
    }

    const { title, description, category, tags } = req.body
    
    if (!title || !category) {
      return res.status(400).json({ error: '标题和分类为必填项' })
    }

    // 在实际应用中，这里应该处理图片优化和生成不同尺寸
    // 现在使用简单的占位URL
    const imageId = 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    
    const imageData = {
      id: imageId,
      title: title.trim(),
      description: description?.trim() || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      width: 0, // 实际应用中应该获取图片尺寸
      height: 0,
      category: category,
      tags: tags ? JSON.parse(tags) : [],
      downloadUrl: `/uploads/${req.file.filename}`,
      thumbnailUrl: `/uploads/${req.file.filename}`,
      optimizedUrl: `/uploads/${req.file.filename}`
    }

    const newImage = await insertImage(imageData)
    
    res.json({ 
      success: true, 
      image: newImage 
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router