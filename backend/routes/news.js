const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/fetch', async (req, res) => {
  try {
    const response = await axios.get(
      'https://newsapi.org/v2/everything?' +
      'q=finans OR ekonomi OR borsa OR döviz OR altın&' +
      'language=tr&' +
      'sortBy=publishedAt&' +
      'apiKey=85cb54751887489790be09b587c8fff4',
      {
        headers: {
          'X-Api-Key': '85cb54751887489790be09b587c8fff4',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.data || !response.data.articles) {
      throw new Error('Invalid response from News API');
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.response?.data || error.message);
    
    // Send appropriate error response
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Haberler yüklenirken bir hata oluştu',
        details: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'Haber servisi şu anda kullanılamıyor',
        details: 'Lütfen daha sonra tekrar deneyin'
      });
    } else {
      res.status(500).json({
        error: 'Sunucu hatası',
        details: error.message
      });
    }
  }
});

module.exports = router; 