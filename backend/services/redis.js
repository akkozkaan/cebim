const { createClient } = require('redis');

class RedisService {
  constructor() {
    this.client = null;
    this.CACHE_TTL = 3600; // 1 saat
  }

  async connect() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          tls: true,
          rejectUnauthorized: false
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        // Don't throw error, just log it
      });
      
      this.client.on('connect', () => console.log('Redis bağlantısı başarılı'));

      await this.client.connect();
    } catch (error) {
      console.error('Redis bağlantı hatası:', error);
      // Don't throw error, just log it
    }
  }

  // Gelir-gider verilerini önbellekle
  async cacheTransactions(userId, transactions) {
    try {
      if (!this.client) {
        console.log('Redis client not connected, skipping cache');
        return;
      }
      const key = `transactions:${userId}`;
      await this.client.set(key, JSON.stringify(transactions), {
        EX: this.CACHE_TTL
      });
      console.log(`İşlemler önbelleklendi: ${key}`);
    } catch (error) {
      console.error('Önbellekleme hatası:', error);
    }
  }

  // Önbellekten gelir-gider verilerini al
  async getCachedTransactions(userId) {
    try {
      if (!this.client) {
        console.log('Redis client not connected, skipping cache retrieval');
        return null;
      }
      const key = `transactions:${userId}`;
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Önbellekten veri alma hatası:', error);
      return null;
    }
  }

  // Önbellekten gelir-gider verilerini sil
  async invalidateTransactionsCache(userId) {
    try {
      if (!this.client) {
        console.log('Redis client not connected, skipping cache invalidation');
        return;
      }
      const key = `transactions:${userId}`;
      await this.client.del(key);
      console.log(`Önbellek temizlendi: ${key}`);
    } catch (error) {
      console.error('Önbellek temizleme hatası:', error);
    }
  }

  // Aylık toplam gelir-gider verilerini önbellekle
  async cacheMonthlyTotals(userId, totals) {
    try {
      if (!this.client) {
        console.log('Redis client not connected, skipping cache');
        return;
      }
      const key = `monthly_totals:${userId}`;
      await this.client.set(key, JSON.stringify(totals), {
        EX: this.CACHE_TTL
      });
      console.log(`Aylık toplamlar önbelleklendi: ${key}`);
    } catch (error) {
      console.error('Aylık toplam önbellekleme hatası:', error);
    }
  }

  // Önbellekten aylık toplam gelir-gider verilerini al
  async getCachedMonthlyTotals(userId) {
    try {
      if (!this.client) {
        console.log('Redis client not connected, skipping cache retrieval');
        return null;
      }
      const key = `monthly_totals:${userId}`;
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Aylık toplam önbellekten alma hatası:', error);
      return null;
    }
  }

  // Önbellekten aylık toplam gelir-gider verilerini sil
  async invalidateMonthlyTotalsCache(userId) {
    try {
      if (!this.client) {
        console.log('Redis client not connected, skipping cache invalidation');
        return;
      }
      const key = `monthly_totals:${userId}`;
      await this.client.del(key);
      console.log(`Aylık toplam önbelleği temizlendi: ${key}`);
    } catch (error) {
      console.error('Aylık toplam önbellek temizleme hatası:', error);
    }
  }

  async close() {
    try {
      if (this.client) {
        await this.client.quit();
        console.log('Redis bağlantısı kapatıldı');
      }
    } catch (error) {
      console.error('Redis kapatma hatası:', error);
    }
  }
}

module.exports = new RedisService(); 