const amqp = require('amqplib');

class ReminderConsumer {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.QUEUE_NAME = 'reminders';
    this.MAX_RETRIES = 3;
    this.RETRY_DELAY = 5000; // 5 saniye
  }

  async connect() {
    try {
      if (!process.env.RABBITMQ_URL) {
        console.log('RABBITMQ_URL not set, ReminderConsumer will not be used');
        return;
      }

      console.log('RabbitMQ bağlantısı başlatılıyor...');
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      console.log('RabbitMQ bağlantısı başarılı');
      
      this.channel = await this.connection.createChannel();
      console.log('RabbitMQ kanalı oluşturuldu');
      
      // Kuyruğu oluştur
      await this.channel.assertQueue(this.QUEUE_NAME, {
        durable: true
      });
      console.log(`${this.QUEUE_NAME} kuyruğu oluşturuldu/doğrulandı`);

      // Prefetch değerini ayarla (aynı anda işlenecek mesaj sayısı)
      await this.channel.prefetch(10);
      console.log('Prefetch değeri ayarlandı: 10');

      console.log('Reminder Consumer bağlantısı başarılı');
    } catch (error) {
      console.error('Reminder Consumer bağlantı hatası:', error);
      // Don't throw error, just log it
    }
  }

  async startConsuming() {
    try {
      if (!this.channel) {
        console.log('Kanal bulunamadı, bağlantı kuruluyor...');
        await this.connect();
      }

      if (!this.channel) {
        console.log('RabbitMQ not available, consumer will not start');
        return;
      }

      console.log('Hatırlatıcı işleme başlatılıyor...');

      this.channel.consume(this.QUEUE_NAME, async (msg) => {
        if (!msg) return;

        console.log('Yeni mesaj alındı');
        
        try {
          const reminder = JSON.parse(msg.content.toString());
          console.log('İşlenen hatırlatıcı:', reminder);

          // Hatırlatıcı zamanı kontrolü
          const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
          const now = new Date();
          console.log('Hatırlatıcı zamanı:', reminderTime);
          console.log('Şu anki zaman:', now);

          if (reminderTime > now) {
            // Hatırlatıcı zamanı gelmedi, tekrar kuyruğa ekle
            const delay = reminderTime - now;
            console.log(`Hatırlatıcı ${delay}ms sonra tekrar kuyruğa eklenecek`);
            
            setTimeout(() => {
              console.log('Hatırlatıcı tekrar kuyruğa ekleniyor...');
              this.channel.sendToQueue(this.QUEUE_NAME, msg.content);
            }, delay);
          } else {
            // Hatırlatıcı zamanı geldi, bildirim gönder
            console.log('Hatırlatıcı zamanı geldi, bildirim gönderiliyor...');
            await this.sendNotification(reminder);
          }

          // Mesajı onayla
          console.log('Mesaj onaylanıyor...');
          this.channel.ack(msg);
          console.log('Mesaj onaylandı');
        } catch (error) {
          console.error('Hatırlatıcı işleme hatası:', error);
          
          // Hata durumunda yeniden deneme
          const retryCount = msg.properties.headers?.retryCount || 0;
          console.log(`Yeniden deneme sayısı: ${retryCount}`);
          
          if (retryCount < this.MAX_RETRIES) {
            // Mesajı tekrar kuyruğa ekle
            console.log('Mesaj tekrar kuyruğa ekleniyor...');
            setTimeout(() => {
              this.channel.sendToQueue(this.QUEUE_NAME, msg.content, {
                headers: { retryCount: retryCount + 1 }
              });
            }, this.RETRY_DELAY);
          }
          
          console.log('Hatalı mesaj onaylanıyor...');
          this.channel.ack(msg);
          console.log('Hatalı mesaj onaylandı');
        }
      });
      
      console.log('Consumer başarıyla başlatıldı ve mesajları dinliyor...');
    } catch (error) {
      console.error('Consumer başlatma hatası:', error);
      // Don't throw error, just log it
    }
  }

  async sendNotification(reminder) {
    // Burada bildirim gönderme işlemi yapılacak
    // Örneğin: e-posta, SMS, push notification vb.
    console.log(`Bildirim gönderiliyor: ${reminder.title}`);
    // Şimdilik sadece log atıyoruz
    return Promise.resolve();
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('Consumer kapatma hatası:', error);
      // Don't throw error, just log it
    }
  }
}

module.exports = new ReminderConsumer(); 