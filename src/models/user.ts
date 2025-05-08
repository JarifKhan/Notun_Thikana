import mongoose from 'mongoose';

// Notification schema to store structured data
const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Added title field
  message: { type: String, required: true },
  type: { type: String, enum: ['bid', 'rental', 'announcement', 'listing'], required: true }, // Added 'listing' type
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: false }, // Added description field
  time: { type: String, required: false }, // Added time field
  urgency: { type: String, enum: ['regular', 'urgent'], required: false }, // Added urgency field
  image: { type: String, required: false }, // Added image field
  actions: { type: [String], required: false } // Added actions field
}, { _id: false }); // No need for _id in each notification object

// User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Added password field
  notifications: { type: [NotificationSchema], default: [] } // Array of notification objects
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
