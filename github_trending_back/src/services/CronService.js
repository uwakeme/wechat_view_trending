const cron = require('node-cron');
const winston = require('winston');
const GitHubService = require('./GitHubService');
const Repository = require('../models/Repository');

class CronService {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'cron.log' })
      ]
    });
  }

  async updateTrendingRepositories() {
    try {
      this.logger.info('Starting trending repositories update');
      const periods = ['daily', 'weekly', 'monthly'];
      const languages = ['', 'JavaScript', 'Python', 'Java', 'Go', 'TypeScript', 'C++', 'Ruby', 'PHP', 'C#', 'Swift'];

      for (const period of periods) {
        for (const language of languages) {
          const data = await GitHubService.getTrendingRepositories(language, period);
          const repositories = data.items.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
            description: repo.description,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            topics: repo.topics,
            owner: {
              login: repo.owner.login,
              avatar_url: repo.owner.avatar_url,
              html_url: repo.owner.html_url
            },
            trending_period: period,
            cache_expires_at: new Date(Date.now() + 3600000) // 1 hour cache
          }));

          // 使用 upsert 更新或插入数据
          for (const repo of repositories) {
            await Repository.findOneAndUpdate(
              { id: repo.id, trending_period: period },
              repo,
              { upsert: true, new: true }
            );
          }

          this.logger.info(`Updated ${repositories.length} ${language || 'all'} repositories for ${period} period`);
          
          // 避免触发GitHub API限制
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 清理过期缓存
      await Repository.deleteMany({
        cache_expires_at: { $lt: new Date() }
      });

      this.logger.info('Completed trending repositories update');
    } catch (error) {
      this.logger.error('Error updating trending repositories:', error);
    }
  }

  startCronJobs() {
    // 每小时更新一次数据
    cron.schedule('0 * * * *', () => {
      this.updateTrendingRepositories();
    });

    this.logger.info('Cron jobs started');
  }
}

module.exports = new CronService();