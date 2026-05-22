const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date:        { type: Date,   required: true },
  mediaUrl:    { type: String, default: '' },         // Cloudinary or local URL
  mediaType:   { type: String, enum: ['photo', 'video', 'none'], default: 'none' },
  publicId:    { type: String, default: '' },         // Cloudinary public_id for deletion
  emoji:       { type: String, default: '🌹' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Memory', memorySchema);
