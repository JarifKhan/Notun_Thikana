// models/Listing.js
import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
