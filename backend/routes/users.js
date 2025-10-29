const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
});


// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // ✅ FIX: Return ALL required fields
    res.json({ 
      token, 
      userId: user._id.toString(),
      role: user.role,
      name: user.name
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide hashed passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
