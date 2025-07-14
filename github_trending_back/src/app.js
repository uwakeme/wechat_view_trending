require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');

// 创建Express应用
const app = express();

// 配置日志记录器
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 导入CronService
const CronService = require('./services/CronService');

// 连接MongoDB数据库
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Successfully connected to MongoDB.');
    
    // 启动定时任务
    CronService.startCronJobs();
    
    // 立即执行一次数据更新
    console.log('正在初始化GitHub趋势数据，请稍候...');
    CronService.updateTrendingRepositories()
      .then(() => {
        console.log('✅ GitHub趋势数据初始化完成！');
      })
      .catch(err => {
        console.error('❌ GitHub趋势数据初始化失败:', err.message);
      });
    
    // 数据库连接成功后，显示应用程序启动完成的消息
    setTimeout(() => {
      console.log('\n====================================================');
      console.log('🚀 GitHub Trending API 服务已成功启动！');
      console.log(`📡 API服务地址: http://localhost:${process.env.PORT || 3000}`);
      console.log('📊 可用端点:');
      console.log('   - GET /api/trending - 获取趋势项目');
      console.log('   - GET /api/repos/:owner/:repo - 获取特定仓库信息');
      console.log('   - GET /api/users/:username - 获取用户信息');
      console.log('   - GET /api/languages - 获取支持的编程语言列表');
      console.log('====================================================\n');
    }, 1000);
  })
  .catch((error) => logger.error('Error connecting to MongoDB:', error));

// 路由配置
app.use('/api/trending', require('./routes/trending'));
app.use('/api/repos', require('./routes/repos'));
app.use('/api/users', require('./routes/users'));
app.use('/api/languages', require('./routes/languages'));

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;