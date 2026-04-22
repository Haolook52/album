import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import imageRoutes from './routes/images.js'
import uploadRoutes from './routes/upload.js'
import searchRoutes from './routes/search.js'
import adminRoutes from './routes/admin.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

// API Routes
app.use('/api/images', imageRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/admin', adminRoutes)

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
})