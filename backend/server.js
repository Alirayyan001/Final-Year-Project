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
  password: String
});

const User = mongoose.model('User', userSchema);

// Define Wallet schema and model
const walletSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  balance: {
    type: Number,
    default: 0
  }
});

const Wallet = mongoose.model('Wallet', walletSchema);

// Define Announcement schema and model with automatic timestamps
const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);

// Define Top-up schema and model
const topupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  accountType: String,
  accountNumber: Number,
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
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'wallets', // 'wallets' is the collection name in MongoDB
          localField: '_id',
          foreignField: 'userId',
          as: 'wallet'
        }
      },
      {
        $unwind: {
          path: '$wallet',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          fullname: 1,
          mobile: 1,
          email: 1,
          balance: { $ifNull: ['$wallet.balance', 0] } // If no wallet, set balance to 0
        }
      }
    ]);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Topup.deleteMany({ user: id });  // Delete associated top-ups
    await Wallet.findOneAndDelete({ userId: id });  // Delete associated wallet
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
    const topup = await Topup.findById(req.params.id).populate('user');
    if (!topup) {
      return res.status(404).json({ message: 'Top-up request not found' });
    }

    if (topup.status === 'approved') {
      return res.status(400).json({ message: 'Top-up request is already approved' });
    }

    topup.status = 'approved';
    await topup.save();

    // Update the user's wallet balance
    let wallet = await Wallet.findOne({ userId: topup.user._id });
    if (wallet) {
      wallet.balance += topup.amount;
      await wallet.save();
    } else {
      // If the wallet doesn't exist, create one
      await Wallet.create({ userId: topup.user._id, balance: topup.amount });
    }

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
