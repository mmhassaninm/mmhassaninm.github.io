const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Safe export for serverless environments (prevents compilation errors on reload)
module.exports = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
