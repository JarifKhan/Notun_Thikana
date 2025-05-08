import connectToDatabase from "@/lib/dbConnect";
import Blog from "@/models/blog";
import mongoose from "mongoose";
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = context.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response("Invalid blog ID format", { status: 400 });
  }

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      console.log("Blog fetched:", blog);
      return new Response("Blog not found", { status: 404 });
    }

    return new Response(JSON.stringify(blog), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return new Response("Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = context.params;
  console.log("PATCH request for ID:", id);

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid blog ID format");
    return new Response("Invalid blog ID format", { status: 400 });
  }

  try {
    const { increment, userId } = await request.json();
    console.log("Increment value received:", increment);
    console.log("User ID received:", userId);

    // If no userId is provided, return an error
    if (!userId) {
      console.error("No user ID provided");
      return new Response("User ID is required", { status: 400 });
    }

    // First, check if the user has already liked this blog
    const blog = await Blog.findById(id);

    if (!blog) {
      console.error("Blog not found");
      return new Response("Blog not found", { status: 404 });
    }

    const userHasLiked = blog.likedBy && blog.likedBy.includes(userId);

    // If user is trying to like and has already liked, or trying to unlike and hasn't liked
    if ((increment > 0 && userHasLiked) || (increment < 0 && !userHasLiked)) {
      console.log("Invalid like operation: User has already performed this action");
      return new Response(
        JSON.stringify({
          error: "Invalid operation",
          message: increment > 0 ? "You have already liked this post" : "You haven't liked this post yet",
          currentLikes: blog.likes
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Update the blog with the appropriate operation
    let updateOperation;
    if (increment > 0) {
      // User is liking the blog
      updateOperation = {
        $inc: { likes: 1 },
        $push: { likedBy: userId }
      };
    } else {
      // User is unliking the blog
      updateOperation = {
        $inc: { likes: -1 },
        $pull: { likedBy: userId }
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateOperation,
      { new: true }
    );

    if (!updatedBlog) {
      console.error("Blog not found");
      return new Response("Blog not found", { status: 404 });
    }

    console.log("Updated blog:", updatedBlog);

    return new Response(JSON.stringify(updatedBlog), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating blog:", error); // Log exact error
    return new Response("Failed to update blog", { status: 500 });
  }
}


