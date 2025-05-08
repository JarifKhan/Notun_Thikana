import mongoose from 'mongoose';

const TrendingTopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    count: { type: Number, default: 1 },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.TrendingTopic || mongoose.model('TrendingTopic', TrendingTopicSchema);
