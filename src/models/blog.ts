import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        image: { type: String, required: true },
        category: { type: String, required: true },
        excerpt: { type: String, required: true },
        author: {
            name: { type: String, required: true },
            avatar: { type: String, required: true },
        },
        date: { type: Date, default: Date.now },
        readTime: { type: String, required: true },
        likes: { type: Number, default: 0 },
        likedBy: [{ type: String }], // Array of user IDs who liked the post
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
