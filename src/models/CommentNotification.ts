import mongoose from "mongoose";

const CommentNotification = new mongoose.Schema(
	{
		communityForumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CommunityForum",
			required: true,
		},
		commentBody: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.CommentNotification ||
	mongoose.model("CommentNotification", CommentNotification);
