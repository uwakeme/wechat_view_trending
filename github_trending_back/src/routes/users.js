const express = require('express');
const router = express.Router();
const GitHubService = require('../services/GitHubService');

// 获取用户信息
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userData = await GitHubService.getUser(username);

    res.json({
      login: userData.login,
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
      name: userData.name,
      bio: userData.bio,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Error fetching user data',
      message: error.message
    });
  }
});

module.exports = router;