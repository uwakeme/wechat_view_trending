const express = require('express');
const router = express.Router();
const GitHubService = require('../services/GitHubService');
const Repository = require('../models/Repository');

// 获取仓库详情
router.get('/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    // 先从数据库查询缓存
    let repository = await Repository.findOne({
      'owner.login': owner,
      name: repo,
      cache_expires_at: { $gt: new Date() }
    });

    // 如果没有缓存或缓存过期，从GitHub API获取
    if (!repository) {
      const data = await GitHubService.getRepository(owner, repo);
      repository = {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        html_url: data.html_url,
        description: data.description,
        language: data.language,
        stargazers_count: data.stargazers_count,
        forks_count: data.forks_count,
        created_at: data.created_at,
        updated_at: data.updated_at,
        topics: data.topics,
        owner: {
          login: data.owner.login,
          avatar_url: data.owner.avatar_url,
          html_url: data.owner.html_url
        }
      };
    }

    res.json(repository);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Error fetching repository',
      message: error.message
    });
  }
});

// 获取仓库贡献者列表
router.get('/:owner/:repo/contributors', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { page = 1, per_page = 10 } = req.query;

    const contributors = await GitHubService.getContributors(owner, repo, page, per_page);
    res.json(contributors);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Error fetching contributors',
      message: error.message
    });
  }
});

module.exports = router;