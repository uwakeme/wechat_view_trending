const express = require('express');
const router = express.Router();

// 流行编程语言列表
const popularLanguages = [
  'JavaScript',
  'Python',
  'Java',
  'Go',
  'TypeScript',
  'C++',
  'Ruby',
  'PHP',
  'C#',
  'Swift'
];

// 编程语言颜色映射
const languageColors = {
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'TypeScript': '#2b7489',
  'C++': '#f34b7d',
  'Ruby': '#701516',
  'PHP': '#4F5D95',
  'C#': '#178600',
  'Swift': '#ffac45'
};

// 获取流行编程语言列表
router.get('/', (req, res) => {
  res.json(popularLanguages);
});

// 获取语言颜色映射
router.get('/colors', (req, res) => {
  res.json(languageColors);
});

module.exports = router;