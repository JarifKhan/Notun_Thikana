import mongoose from 'mongoose';

const HouseSchema = new mongoose.Schema({
  title: String,
  location: String,
  pricePerNight: Number,
  images: [String],
  amenities: [String],
  description: String,
  reviews: [
    {
      author: String,
      rating: Number,
      content: String,
      date: String,
      image: String,
    },
  ],
});

export default mongoose.models.Villa || mongoose.model('House', HouseSchema);
