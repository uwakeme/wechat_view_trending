const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  full_name: { type: String, required: true },
  html_url: { type: String, required: true },
  description: String,
  language: String,
  stargazers_count: { type: Number, default: 0 },
  forks_count: { type: Number, default: 0 },
  created_at: Date,
  updated_at: Date,
  topics: [String],
  owner: {
    login: { type: String, required: true },
    avatar_url: String,
    html_url: String
  },
  contributors: [{
    login: String,
    avatar_url: String,
    html_url: String,
    contributions: Number
  }],
  trending_date: { type: Date, default: Date.now },
  trending_period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
  cache_expires_at: { type: Date, required: true }
});

// 创建索引以提高查询性能
repositorySchema.index({ language: 1, trending_date: -1 });
repositorySchema.index({ trending_period: 1 });
repositorySchema.index({ cache_expires_at: 1 });

module.exports = mongoose.model('Repository', repositorySchema);