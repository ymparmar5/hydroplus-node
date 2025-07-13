const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Helper to generate unique userId (simple random string)
const generateUserId = () => 'user_' + Math.random().toString(36).substr(2, 9);

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      userId: generateUserId(),
    });
    await user.save();
    res.status(201).json({ success: true, message: 'Signup successful.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }
    res.json({ success: true, message: 'Login successful.', user: { name: user.name, email: user.email, role: user.role, userId: user.userId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
}; 