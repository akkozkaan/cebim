const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const passport = require('passport');

// Kullanıcının hedefini getir
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const goal = await Goal.findOne({ userId: req.user._id, status: 'active' });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni hedef ekle
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Kullanıcının aktif hedefi var mı kontrol et
    const existingGoal = await Goal.findOne({ userId: req.user._id, status: 'active' });
    if (existingGoal) {
      return res.status(400).json({ message: 'Zaten aktif bir hedefiniz var' });
    }

    const goal = new Goal({
      userId: req.user._id,
      title: req.body.title,
      targetAmount: req.body.targetAmount,
      targetDate: req.body.targetDate,
      description: req.body.description
    });

    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hedefi güncelle
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        title: req.body.title,
        targetAmount: req.body.targetAmount,
        targetDate: req.body.targetDate,
        description: req.body.description,
        currentAmount: req.body.currentAmount,
        status: req.body.status
      },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Hedef bulunamadı' });
    }

    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hedefi sil
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Hedef bulunamadı' });
    }

    res.json({ message: 'Hedef silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 