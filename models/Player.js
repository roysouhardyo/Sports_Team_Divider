import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the player'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating for the player'],
    min: [1, 'Rating must be at least 1'],
    max: [100, 'Rating cannot exceed 100'],
  },
  position: {
    type: String,
    required: [true, 'Please provide a position for the player'],
    enum: {
      values: ['GK', 'DF', 'MF', 'FW'],
      message: 'Position must be GK, DF, MF, or FW',
    },
  },
}, {
  timestamps: true,
});

// Create index for name search
PlayerSchema.index({ name: 'text' });

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);
