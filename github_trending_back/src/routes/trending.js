const express = require('express');
const router = express.Router();
const Repository = require('../models/Repository');

// 获取热门仓库列表
router.get('/', async (req, res) => {
  try {
    const { language, since = 'daily', page = 1, per_page = 25 } = req.query;
    const skip = (page - 1) * per_page;

    const query = {
      trending_period: since,
      cache_expires_at: { $gt: new Date() }
    };

    if (language) {
      query.language = language;
    }

    const [repositories, total_count] = await Promise.all([
      Repository.find(query)
        .sort({ stargazers_count: -1 })
        .skip(skip)
        .limit(parseInt(per_page)),
      Repository.countDocuments(query)
    ]);

    res.json({
      total_count,
      items: repositories
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

module.exports = router;