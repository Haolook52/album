const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
// 确保uploads文件夹存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
// 配置图片上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pic_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
// 静态文件和接口
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(uploadDir));
app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});
app.get('/api/images', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    res.json(files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).map(f => `/uploads/${f}`));
  });
});
// 导出Vercel所需的处理函数
module.exports = app;
