const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
  },
  likes: {
    type: [String], // Array of user IDs
    default: [],
  },
  reports: [ReportSchema], // Array of report objects
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
