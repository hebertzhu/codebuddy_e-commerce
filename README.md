# 电商网站项目

一个现代化的电子商务网站，使用 React 前端和 Node.js 后端构建。

## 功能特性

- 🛍️ 商品浏览和搜索
- 🛒 购物车管理
- 💳 订单结算
- 📱 响应式设计
- 🔐 用户认证（待实现）
- 📊 商品分类和筛选

## 技术栈

### 前端
- React 18
- React Router
- Axios
- Styled Components
- React Icons

### 后端
- Node.js
- Express.js
- MongoDB (可选)
- JWT 认证
- CORS

## 安装和运行

### 前置要求
- Node.js 16+
- npm 或 yarn
- MongoDB (可选，当前使用模拟数据)

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd ecommerce-website
```

2. 安装所有依赖
```bash
npm run install-all
```

或者分别安装：
```bash
# 安装根目录依赖
npm install

# 安装服务器依赖
cd server
npm install

# 安装客户端依赖
cd ../client
npm install
```

3. 配置环境变量
复制 `.env.example` 到 `.env` 并修改配置：
```bash
cp .env.example .env
```

4. 启动开发服务器
```bash
# 同时启动前后端
npm run dev

# 或者分别启动
npm run server  # 启动后端 (端口 5000)
npm run client  # 启动前端 (端口 3000)
```

## 项目结构

```
ecommerce-website/
├── client/                 # React 前端
│   ├── public/            # 静态文件
│   ├── src/
│   │   ├── components/    # 可复用组件
│   │   ├── pages/         # 页面组件
│   │   ├── App.js         # 主应用组件
│   │   └── index.js       # 入口文件
│   └── package.json
├── server/                # Node.js 后端
│   ├── index.js           # 服务器入口
│   └── package.json
├── package.json           # 根目录配置
└── README.md
```

## API 接口

### 商品相关
- `GET /api/products` - 获取商品列表
- `GET /api/products/:id` - 获取单个商品
- `GET /api/products?category=:category` - 按分类筛选
- `GET /api/products?search=:keyword` - 搜索商品

### 订单相关
- `POST /api/orders` - 创建订单
- `GET /api/orders/:id` - 获取订单详情

### 健康检查
- `GET /api/health` - 服务器状态检查

## 开发计划

- [ ] 用户注册和登录
- [ ] 商品评论和评分
- [ ] 支付集成
- [ ] 订单管理后台
- [ ] 商品库存管理
- [ ] 邮件通知
- [ ] 数据分析仪表板

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱：your-email@example.com
- 项目 Issues：<repository-url>/issues