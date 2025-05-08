import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String },
  },
  { _id: false }
);

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: AuthorSchema, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CommunityForumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    preview: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: AuthorSchema, required: true },
    commentCount: { type: Number, default: 0 },
    comments: [CommentSchema],
    likes: { type: Number, default: 0 },
    time: { type: String, required: true }, // You can change this to Date for a real timestamp
  },
  { timestamps: true }
);

export default mongoose.models.CommunityForum || mongoose.model('CommunityForum', CommunityForumSchema);
