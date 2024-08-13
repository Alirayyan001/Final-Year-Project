const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moment = require('moment-timezone');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/EZ-TRANSIT', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Define Announcement schema and model
const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: {
    type: Date,
    default: () => moment().tz('Asia/Karachi').toDate()
  }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// Define Top-up schema and model
const topupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
    const topups = await Topup.find().populate('userId');
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
    
    if (topup) {
      const user = await User.findById(topup.userId);
      
      if (user) {
        user.walletBalance += topup.amount;
        await user.save();
        res.json(topup);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(404).json({ message: 'Top-up request not found' });
    }
  } catch (error) {
    console.error('Error approving top-up request:', error);
    res.status(500).json({ message: 'Error approving top-up request', error });
  }
});

app.post('/api/topups/:id/decline', async (req, res) => {
  try {
    const topup = await Topup.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });
    res.json(topup);
  } catch (error) {
    console.error('Error declining top-up request:', error);
    res.status(500).json({ message: 'Error declining top-up request', error });
  }
});

app.get('/api/topups/approved', async (req, res) => {
  try {
    const topups = await Topup.find({ status: 'approved' }).populate('userId');
    res.json(topups);
  } catch (error) {
    console.error('Error fetching approved top-up requests:', error);
    res.status(500).json({ message: 'Error fetching approved top-up requests', error });
  }
});

app.get('/api/topups/declined', async (req, res) => {
  try {
    const topups = await Topup.find({ status: 'declined' }).populate('userId');
    res.json(topups);
  } catch (error) {
    console.error('Error fetching declined top-up requests:', error);
    res.status(500).json({ message: 'Error fetching declined top-up requests', error });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
