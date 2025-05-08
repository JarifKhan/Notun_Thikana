import { NextResponse } from 'next/server';
import CommunityForum from '@/models/forum';
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { updateTrendingTopic } from '../../trending/route';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    console.log(`GET request for forum post with ID: ${context.params.id}`);

    const { id } = context.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.error(`Invalid forum post ID format: ${id}`);
      return NextResponse.json({ error: 'Invalid forum post ID format' }, { status: 400 });
    }

    const post = await CommunityForum.findById(id);

    if (!post) {
      console.error(`Forum post not found with ID: ${id}`);
      return NextResponse.json({ error: 'Forum post not found' }, { status: 404 });
    }

    console.log(`Successfully fetched forum post: ${JSON.stringify(post)}`);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching forum post:", error);
    return NextResponse.json({ error: 'Failed to fetch forum post', details: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    console.log(`PATCH request for forum post with ID: ${context.params.id}`);

    const { id } = context.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.error(`Invalid forum post ID format: ${id}`);
      return NextResponse.json({ error: 'Invalid forum post ID format' }, { status: 400 });
    }

    // Get request body
    const body = await request.json();
    console.log(`Request body: ${JSON.stringify(body)}`);

    const { increment } = body;

    // Validate increment value
    if (typeof increment !== 'number' || (increment !== 1 && increment !== -1)) {
      console.error(`Invalid increment value: ${increment}`);
      return NextResponse.json({ error: 'Invalid increment value. Must be 1 or -1.' }, { status: 400 });
    }

    // Find the post first to check if it exists
    const post = await CommunityForum.findById(id);

    if (!post) {
      console.error(`Forum post not found with ID: ${id}`);
      return NextResponse.json({ error: 'Forum post not found' }, { status: 404 });
    }

    console.log(`Found post with current likes: ${post.likes}`);

    // Update the post
    const updatedPost = await CommunityForum.findByIdAndUpdate(
      id,
      { $inc: { likes: increment } },
      { new: true }
    );

    console.log(`Post ${id} likes updated from ${post.likes} to ${updatedPost.likes}`);

    // If the post was liked (increment is positive), update trending topics
    if (increment > 0) {
      try {
        await updateTrendingTopic(post.title);
        console.log(`Updated trending topic for post: ${post.title}`);
      } catch (trendingError) {
        console.error('Error updating trending topic:', trendingError);
        // Continue even if trending update fails
      }
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating forum post:", error);
    return NextResponse.json({
      error: 'Failed to update forum post',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
