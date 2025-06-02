const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tasarruf', 'Yatırım', 'Bütçe', 'Borç Yönetimi']
  },
  imageUrl: {
    type: String,
    default: 'https://source.unsplash.com/random/800x400/?finance'
  },
  readTime: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', articleSchema); 