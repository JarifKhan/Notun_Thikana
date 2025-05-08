import { NextResponse } from 'next/server';
import CommunityForum from '@/models/forum';
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

// GET all comments for a specific forum post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if id exists before using it
    if (!params || !params.id) {
      console.error('Missing ID parameter');
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    const { id } = params;
    console.log(`GET request for comments of forum post with ID: ${id}`);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(`Invalid forum post ID format: ${id}`);
      return NextResponse.json({ error: 'Invalid forum post ID format' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // If database connection failed, return error
    if (!mongoose.connection.readyState) {
      console.error('Database connection failed');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Find post with try/catch for database errors
    let post;
    try {
      post = await CommunityForum.findById(id);
    } catch (dbError) {
      console.error(`Database error when finding post: ${dbError}`);
      return NextResponse.json({ error: 'Database error', details: dbError.message }, { status: 500 });
    }

    if (!post) {
      console.error(`Forum post not found with ID: ${id}`);
      return NextResponse.json({ error: 'Forum post not found' }, { status: 404 });
    }

    // Ensure comments is an array and filter out invalid comments
    const comments = Array.isArray(post.comments) ? post.comments : [];

    // Validate each comment to ensure it has the required fields
    const validComments = comments.map(comment => {
      // Ensure comment has an author object with name and avatar
      if (!comment.author || typeof comment.author !== 'object') {
        comment.author = {
          name: "Anonymous User",
          avatar: "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20person%2C%20neutral%20background&width=40&height=40&seq=1&orientation=squarish"
        };
      } else {
        // Ensure author has name and avatar
        if (!comment.author.name) {
          comment.author.name = "Anonymous User";
        }
        if (!comment.author.avatar) {
          comment.author.avatar = "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20person%2C%20neutral%20background&width=40&height=40&seq=1&orientation=squarish";
        }
      }

      // Ensure comment has text
      if (!comment.text || typeof comment.text !== 'string') {
        comment.text = "No comment text";
      }

      // Ensure comment has createdAt
      if (!comment.createdAt) {
        comment.createdAt = new Date().toISOString();
      }

      return comment;
    });

    console.log(`Successfully fetched and validated ${validComments.length} comments for post: ${id}`);
    return NextResponse.json(validComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: 'Failed to fetch comments', details: error.message }, { status: 500 });
  }
}
