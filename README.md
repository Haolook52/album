# 相册网站

这是一个简单的相册网站，用于展示和管理照片。使用 GitHub 和 Vercel 托管。

## 功能特点

- 前端展示照片网格
- 管理员后台上传照片
- 自动生成照片列表
- 响应式设计，适配不同设备

## 项目结构

```
album/
├── api/
│   └── index.js          # 后端 API 服务
├── public/
│   ├── index.html        # 相册展示页面
│   └── admin.html        # 管理员上传页面
├── uploads/              # 上传的照片存储目录
├── package.json          # 项目配置文件
├── vercel.json           # Vercel 配置文件
└── README.md             # 项目说明文件
```

## 部署步骤

### 1. 上传到 GitHub

1. 在 GitHub 上创建一个新的仓库
2. 将项目文件上传到 GitHub 仓库

### 2. 部署到 Vercel

1. 登录 Vercel 账号
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 点击 "Deploy" 按钮
5. 部署完成后，Vercel 会生成一个域名

### 3. 访问网站

- 相册展示页面：`https://你的域名`
- 管理员上传页面：`https://你的域名/admin.html`

## 技术栈

- **前端**：HTML, CSS, JavaScript
- **后端**：Node.js, Express, Multer
- **托管**：GitHub, Vercel

## 注意事项

- 照片上传大小限制为 5MB
- 支持的图片格式：jpg, jpeg, png, gif, webp
- 首次访问时，uploads 目录会自动创建

## 本地开发

如果你想在本地开发和测试：

1. 安装 Node.js
2. 运行 `npm install` 安装依赖
3. 运行 `npm start` 启动服务
4. 访问 `http://localhost:3000` 查看相册
5. 访问 `http://localhost:3000/admin.html` 上传照片
