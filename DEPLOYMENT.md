# 部署指南

本文档详细介绍了如何将 ImageShare 图片分享平台部署到 GitHub Pages 和 Vercel 平台，并配置自定义域名。

## 📋 部署前准备

### 环境要求
- Node.js 16.0 或更高版本
- Git 版本控制工具
- GitHub 账户
- Vercel 账户（可选）
- 自有域名（可选）

### 项目配置检查
确保以下文件已正确配置：
- `package.json` - 包含正确的构建脚本
- `vite.config.ts` - 配置了正确的构建输出目录
- `vercel.json` - Vercel 部署配置
- `.github/workflows/deploy.yml` - GitHub Actions 工作流

## 🚀 GitHub Pages 部署

### 步骤 1: 创建 GitHub 仓库
1. 在 GitHub 上创建新的仓库
2. 将本地代码推送到仓库：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

### 步骤 2: 配置 GitHub Pages
1. 进入仓库的 "Settings" 页面
2. 在左侧菜单选择 "Pages"
3. 在 "Source" 部分选择 "GitHub Actions"
4. 保存设置

### 步骤 3: 自动部署
GitHub Actions 会在每次推送到 main 分支时自动构建和部署：
- 工作流文件：`.github/workflows/deploy.yml`
- 构建输出目录：`dist/`
- 访问地址：`https://<用户名>.github.io/<仓库名>`

### 步骤 4: 自定义域名（可选）
1. 在仓库的 "Settings" → "Pages" 中设置自定义域名
2. 在域名服务商添加 CNAME 记录：
```
类型: CNAME
名称: www（或留空）
值: <用户名>.github.io
```
3. 等待 DNS 生效（最长 48 小时）

## 🌐 Vercel 部署

### 步骤 1: 连接 Vercel
1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库

### 步骤 2: 配置项目
1. 项目名称：输入项目名称
2. 框架预设：选择 "Vite"
3. 根目录：保持默认
4. 构建命令：`npm run build`
5. 输出目录：`dist`
6. 安装命令：`npm install`

### 步骤 3: 环境变量（如果需要）
在项目设置中添加环境变量：
- `NODE_ENV=production`
- 其他 API 密钥等

### 步骤 4: 部署
1. 点击 "Deploy"
2. 等待构建完成
3. 访问自动生成的域名

### 步骤 5: 自定义域名
1. 在 Vercel 项目设置中选择 "Domains"
2. 添加自定义域名
3. 按照提示配置 DNS 记录

## 🔧 部署配置详解

### GitHub Actions 工作流
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Vercel 配置
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🛠️ 故障排除

### 常见问题

#### 构建失败
- 检查 Node.js 版本是否符合要求
- 确认所有依赖项正确安装
- 查看构建日志中的具体错误信息

#### 页面空白
- 检查路由配置是否正确
- 确认静态资源路径正确
- 查看浏览器控制台错误信息

#### 图片无法显示
- 检查图片上传路径配置
- 确认文件权限设置正确
- 验证 CDN 配置（如果使用）

#### 自定义域名问题
- 检查 DNS 记录是否正确配置
- 确认域名已正确指向部署平台
- 等待 DNS 传播完成（最长 48 小时）

### 性能优化建议

#### 构建优化
- 启用代码分割
- 压缩静态资源
- 使用 CDN 加速

#### 运行时优化
- 启用浏览器缓存
- 使用图片懒加载
- 优化 API 响应时间

## 📊 监控和维护

### 性能监控
- 使用 Google Analytics 跟踪访问量
- 配置错误监控（如 Sentry）
- 定期检查页面加载速度

### 定期维护
- 更新依赖包版本
- 备份数据库（如果使用）
- 检查安全漏洞
- 优化图片存储策略

## 🔒 安全注意事项

### 部署安全
- 使用 HTTPS 协议
- 配置适当的安全头
- 定期更新依赖包
- 限制文件上传类型和大小

### 数据安全
- 加密敏感数据
- 定期备份重要数据
- 实施访问控制
- 监控异常活动

## 📞 支持

如果遇到部署问题，请：
1. 查看本文档的故障排除部分
2. 检查部署平台的文档
3. 在项目 Issues 中提出问题
4. 联系技术支持

---

**部署成功提示**：部署完成后，请务必测试所有功能，包括图片上传、搜索、分类等，确保一切正常运行。