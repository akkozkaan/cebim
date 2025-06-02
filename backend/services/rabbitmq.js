const amqp = require('amqplib');

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.QUEUE_NAME = 'reminders';
  }

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.QUEUE_NAME, {
        durable: true
      });
      console.log('RabbitMQ bağlantısı başarılı');
    } catch (error) {
      console.error('RabbitMQ bağlantı hatası:', error);
      throw error;
    }
  }

  async sendReminder(reminder) {
    try {
      if (!this.channel) {
        await this.connect();
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
      throw error;
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
      throw error;
    }
  }
}

module.exports = new RabbitMQService(); 