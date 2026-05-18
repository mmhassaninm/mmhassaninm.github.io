const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  allowedSections: {
    type: [String],
    default: []
  },
  defaultSections: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }
});

module.exports = mongoose.models.Template || mongoose.model('Template', TemplateSchema);
