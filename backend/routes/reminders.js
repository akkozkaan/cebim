const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const passport = require('passport');
const rabbitmqService = require('../services/rabbitmq');

// Tüm hatırlatıcıları getir
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).sort({ date: 1, time: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni hatırlatıcı ekle
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const reminder = new Reminder({
      userId: req.user._id,
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      description: req.body.description
    });
    const newReminder = await reminder.save();
    
    // RabbitMQ'ya hatırlatıcıyı gönder
    await rabbitmqService.sendReminder(newReminder);
    
    res.status(201).json(newReminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hatırlatıcı güncelle
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        description: req.body.description
      },
      { new: true }
    );
    
    if (!reminder) {
      return res.status(404).json({ message: 'Hatırlatıcı bulunamadı' });
    }
    
    // Güncellenmiş hatırlatıcıyı RabbitMQ'ya gönder
    await rabbitmqService.sendReminder(reminder);
    
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hatırlatıcı sil
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!reminder) {
      return res.status(404).json({ message: 'Hatırlatıcı bulunamadı' });
    }
    res.json({ message: 'Hatırlatıcı silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 