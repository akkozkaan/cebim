const amqp = require('amqplib');

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.QUEUE_NAME = 'reminders';
  }

  async connect() {
    try {
      if (!process.env.RABBITMQ_URL) {
        console.log('RABBITMQ_URL not set, RabbitMQ will not be used');
        return;
      }

      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.QUEUE_NAME, {
        durable: true
      });
      console.log('RabbitMQ bağlantısı başarılı');
    } catch (error) {
      console.error('RabbitMQ bağlantı hatası:', error);
      // Don't throw error, just log it
    }
  }

  async sendReminder(reminder) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      if (!this.channel) {
        console.log('RabbitMQ not available, skipping reminder queue');
        return;
      }
      
      const message = {
        reminderId: reminder._id,
        userId: reminder.userId,
        title: reminder.title,
        date: reminder.date,
        time: reminder.time,
        description: reminder.description
      };

      await this.channel.sendToQueue(
        this.QUEUE_NAME,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true
        }
      );

      console.log('Hatırlatıcı kuyruğa eklendi:', message);
    } catch (error) {
      console.error('Hatırlatıcı gönderme hatası:', error);
      // Don't throw error, just log it
    }
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
      console.error('RabbitMQ kapatma hatası:', error);
      // Don't throw error, just log it
    }
  }
}

module.exports = new RabbitMQService(); 