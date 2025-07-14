const axios = require('axios');
const winston = require('winston');

class GitHubService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_API_TOKEN}`
      }
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'github-api.log' })
      ]
    });
  }

  async getTrendingRepositories(language = '', since = 'daily') {
    try {
      const date = new Date();
      switch (since) {
        case 'weekly':
          date.setDate(date.getDate() - 7);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() - 1);
          break;
        default: // daily
          date.setDate(date.getDate() - 1);
      }

      const query = `stars:>1000 created:>${date.toISOString().split('T')[0]}`;
      const languageQuery = language ? ` language:${language}` : '';

      const response = await this.api.get('/search/repositories', {
        params: {
          q: query + languageQuery,
          sort: 'stars',
          order: 'desc',
          per_page: 100
        }
      });

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching trending repositories:', error);
      throw error;
    }
  }

  async getRepository(owner, repo) {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching repository ${owner}/${repo}:`, error);
      throw error;
    }
  }

  async getContributors(owner, repo, page = 1, perPage = 10) {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/contributors`, {
        params: {
          page,
          per_page: perPage
        }
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching contributors for ${owner}/${repo}:`, error);
      throw error;
    }
  }

  async getUser(username) {
    try {
      const response = await this.api.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching user ${username}:`, error);
      throw error;
    }
  }
}

module.exports = new GitHubService();