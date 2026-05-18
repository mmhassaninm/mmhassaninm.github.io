const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  templateId: {
    type: String,
    default: 'default'
  },
  sections: {
    type: [SectionSchema],
    default: []
  },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  isHome: {
    type: Boolean,
    default: false
  },
  showInNav: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models.Page || mongoose.model('Page', PageSchema);
