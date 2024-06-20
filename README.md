orderbook_react 


## 详细说明
├── public/ # 公共资源目录
│ ├── index.html # HTML 入口文件
│ └── ... # 其他静态资源
├── src/ # 源代码目录
│ ├── assets/ # 静态资源（图片、样式等）
│ ├── components/ # React 组件
│ │ ├── TradeData.js # 主要的交易数据组件
│ │ ├── TradeDataForm.js # 交易数据表单组件
│ │ └── ... # 其他组件
│ ├── hooks/ # 自定义 Hook
│ │ └── useTradeData.js # 交易数据的自定义 Hook
│ ├── App.js # 应用的根组件
│ ├── index.js # 应用的入口文件
│ └── ... # 其他源文件
├── package.json # 项目依赖和脚本
├── package-lock.json # 锁定依赖版本
└── README.md # 项目说明文件

### `public/`
- `index.html`：应用的 HTML 入口文件，包含一个 `div` 元素作为 React 应用的挂载点。

### `src/`
- `assets/`：存放静态资源，如图片、样式文件等。
- `components/`：存放 React 组件。
  - `TradeData.js`：主要的交易数据组件，负责显示和处理交易数据。
  - `TradeDataForm.js`：交易数据表单组件，包含用户输入的表单。
- `hooks/`：存放自定义 Hook。
  - `useTradeData.js`：自定义 Hook，用于管理交易数据的状态和逻辑。
- `App.js`：应用的根组件，包含应用的主要结构和路由。
- `index.js`：应用的入口文件，负责渲染根组件到 HTML 入口文件中的 `div` 元素。

### `package.json`
- 项目的依赖和脚本配置文件。

### `package-lock.json`
- 锁定依赖版本，确保项目在不同环境下安装相同的依赖版本。

### `README.md`
- 项目说明文件，包含项目的介绍、安装和使用说明。

## 前端依赖包
{
  "name": "orderbook_react",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@mui/icons-material": "^5.0.0",          // Material-UI 图标
    "@mui/material": "^5.0.0",                // Material-UI 组件库
    "axios": "^0.21.1",                       // HTTP 客户端
    "react": "^17.0.2",                       // React 核心库
    "react-dom": "^17.0.2",                   // React DOM 渲染库
    "react-scripts": "4.0.3",                 // React 脚本和配置
    "web-vitals": "^1.0.1"                    // Web 性能指标
  },
  "scripts": {
    "start": "react-scripts start",           // 启动开发服务器
    "build": "react-scripts build",           // 构建项目
    "test": "react-scripts test",             // 运行测试
    "eject": "react-scripts eject"            // 弹出配置
  },

## 后端依赖包
Flask==2.0.1                      # Flask 框架
Flask-CORS==3.0.10                # Flask 跨域资源共享
Flask-SQLAlchemy==2.5.1           # Flask SQLAlchemy 扩展
pandas==1.3.0                     # 数据处理库
pymysql==1.0.2                    # MySQL 数据库连接器
SQLAlchemy==1.4.18                # SQLAlchemy ORM


