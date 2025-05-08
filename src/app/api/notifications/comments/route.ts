import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CommentNotification from "@/models/CommentNotification";

export async function GET() {
	try {
		await dbConnect();

		const notifications = await CommentNotification.find()
			.sort({ createdAt: -1 }) // Sort by most recent
			.populate("communityForumId", "title"); // Populate related forum post title

		return NextResponse.json(notifications, { status: 200 });
	} catch (error) {
		console.error("Error fetching comment notifications:", error);
		return NextResponse.json(
			{ error: "Failed to fetch notifications" },
			{ status: 500 }
		);
	}
}
