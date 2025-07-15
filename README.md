# 微信查看GitHub趋势项目

一个用于在微信小程序中浏览和查看GitHub热门趋势项目的应用。本项目包含前端微信小程序和后端API服务两部分。

## 项目结构

```
wechat_view_trending/
  ├── github_trending_back/      # 后端API服务
  └── github_trending_front/     # 前端微信小程序
```

## 功能特性

- 查看GitHub当前热门趋势项目
- 按编程语言筛选项目
- 查看项目详情（包括星标数、描述、贡献者等）
- 支持缓存机制，提高加载速度

## 技术栈

### 后端 (github_trending_back)
- Node.js
- Express
- MongoDB
- GitHub API 集成

### 前端 (github_trending_front)
- 微信小程序框架
- WXML/WXSS

## 安装与使用

### 后端设置

1. 进入后端目录：
   ```bash
   cd github_trending_back
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建环境配置文件：
   ```bash
   cp .env.example .env
   ```
   
4. 编辑`.env`文件，填入必要的配置信息（见配置部分）

5. 启动服务器：
   ```bash
   npm start
   ```

### 前端设置

1. 进入前端目录：
   ```bash
   cd github_trending_front
   ```

2. 使用微信开发者工具打开项目目录

3. 在`config/config.js`中配置后端API地址

4. 在微信开发者工具中编译并预览

## 配置说明

### 后端配置 (.env 文件)

```
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/github_trending

# GitHub API配置
GITHUB_API_URL=https://api.github.com
GITHUB_TOKEN=your_github_personal_access_token_here

# 其他配置
CACHE_DURATION=3600
LOG_LEVEL=info
```

**重要安全提示：**
- 不要将包含真实凭据的`.env`文件提交到版本控制系统
- `.env`文件已添加到`.gitignore`
- 获取GitHub Personal Access Token: [GitHub文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## API文档

后端API提供以下主要端点：

- `GET /api/trending` - 获取GitHub趋势项目
- `GET /api/trending/:language` - 获取特定语言的趋势项目
- `GET /api/languages` - 获取支持的语言列表

详细API文档请参考`github_trending_front/api_documentation.txt`

## 开发指南

### 添加新功能

1. 在后端创建新路由和控制器
2. 在前端添加相应页面和组件
3. 更新配置和文档

### 调试

- 后端日志位于`github_trending_back/`目录下的各种日志文件
- 前端可使用微信开发者工具的调试控制台

## 贡献指南

欢迎提交Pull Request或Issue来改进项目。在提交代码前，请确保：

1. 代码符合项目的编码规范
2. 添加了必要的测试
3. 更新了相关文档

## 许可证

[MIT许可证](LICENSE)
