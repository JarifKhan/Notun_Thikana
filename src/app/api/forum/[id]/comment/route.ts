import { NextResponse } from "next/server";
import CommunityForum from "@/models/forum";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import CommentNotification from "@/models/CommentNotification";

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return NextResponse.json(
			{ error: "Invalid forum post ID" },
			{ status: 400 }
		);
	}

	try {
		await dbConnect();

		const post = await CommunityForum.findById(id);
		if (!post) {
			return NextResponse.json(
				{ error: "Forum post not found" },
				{ status: 404 }
			);
		}

		const { text, author } = await request.json();
		if (!text || !author || !author.name) {
			return NextResponse.json(
				{ error: "Invalid comment data" },
				{ status: 400 }
			);
		}

		const newComment = {
			text,
			author,
			createdAt: new Date(),
		};

		post.comments.push(newComment);
		post.commentCount += 1;
		await post.save();

		// Create a new CommentNotification
		await CommentNotification.create({
			communityForumId: post._id,
			commentBody: text,
		});

		return NextResponse.json(newComment, { status: 201 });
	} catch (error) {
		console.error("Error adding comment:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
