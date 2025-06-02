const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const rabbitmqService = require('./services/rabbitmq');
const reminderConsumer = require('./services/reminderConsumer');
const redisService = require('./services/redis');
require('dotenv').config();
require('./config/passport');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://cebim-frontend.vercel.app', 'https://cebim15.vercel.app']
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// RabbitMQ bağlantısı ve consumer başlatma
async function startRabbitMQ() {
  try {
    console.log('RabbitMQ servisleri başlatılıyor...');
    
    // Önce RabbitMQ servisini başlat
    await rabbitmqService.connect();
    console.log('RabbitMQ servisi başlatıldı');
    
    // Sonra consumer'ı başlat
    await reminderConsumer.connect();
    console.log('Reminder Consumer bağlantısı kuruldu');
    
    // Consumer'ı başlat
    await reminderConsumer.startConsuming();
    console.log('Reminder Consumer başlatıldı');
    
  } catch (error) {
    console.error('RabbitMQ başlatma hatası:', error);
    // Hata durumunda 5 saniye sonra tekrar dene
    setTimeout(startRabbitMQ, 5000);
  }
}

// RabbitMQ'yu başlat
startRabbitMQ();

// Redis bağlantısını başlat
redisService.connect().catch(err => {
  console.error('Redis bağlantı hatası:', err);
  process.exit(1);
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/transactions', require('./routes/transactions'));
app.use('/reminders', require('./routes/reminders'));
app.use('/goals', require('./routes/goals'));
app.use('/articles', require('./routes/articles'));
app.use('/news', require('./routes/news'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Uygulama kapatıldığında bağlantıları kapat
process.on('SIGINT', async () => {
  try {
    await Promise.all([
      rabbitmqService.close(),
      reminderConsumer.close()
    ]);
    console.log('Bağlantılar kapatıldı');
    await redisService.close();
    process.exit(0);
  } catch (error) {
    console.error('Kapatma hatası:', error);
    process.exit(1);
  }
}); 