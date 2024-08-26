const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moment = require('moment-timezone');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/EZ-TRANSIT')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define User schema and model
const userSchema = new mongoose.Schema({
  fullname: String,
  mobile: String,
  email: String,
  password: String,
  walletBalance: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', userSchema);

// Define Announcement schema and model with automatic timestamps
const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
}, { timestamps: true });  // This will automatically add `createdAt` and `updatedAt` fields

const Announcement = mongoose.model('Announcement', announcementSchema);

// Define Top-up schema and model
const topupSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  accountType: String,
  accountNumber: Number,
  amount: Number,
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending'
  }
});

const Topup = mongoose.model('Topup', topupSchema);

// API routes for users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Topup.deleteMany({ userId: id });  // Delete associated top-ups
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API routes for announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API routes for top-up requests
app.get('/api/topups', async (req, res) => {
  try {
    const topups = await Topup.find();
    res.json(topups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/topups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Topup.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/topups/:id/approve', async (req, res) => {
  try {
    const topup = await Topup.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(topup);
  } catch (error) {
    res.status(500).json({ message: 'Error approving top-up request', error });
  }
});

app.post('/api/topups/:id/decline', async (req, res) => {
  try {
    const topup = await Topup.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });
    res.json(topup);
  } catch (error) {
    res.status(500).json({ message: 'Error declining top-up request', error });
  }
});

app.get('/api/topups/approved', async (req, res) => {
  try {
    const topups = await Topup.find({ status: 'approved' });
    res.json(topups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved top-up requests', error });
  }
});

app.get('/api/topups/declined', async (req, res) => {
  try {
    const topups = await Topup.find({ status: 'declined' });
    res.json(topups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching declined top-up requests', error });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
