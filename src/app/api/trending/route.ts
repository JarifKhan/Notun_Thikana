import { NextResponse } from 'next/server';
import TrendingTopic from '@/models/trendingTopic';
import CommunityForum from '@/models/forum';
import dbConnect from "@/lib/dbConnect";

// GET trending topics
export async function GET() {
  try {
    await dbConnect();
    
    // If database connection failed, return error
    if (!mongoose.connection.readyState) {
      console.error('Database connection failed');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // First check if we have any trending topics in the database
    let trendingTopics = await TrendingTopic.find()
      .sort({ count: -1, lastUpdated: -1 })
      .limit(5);

    // If no trending topics exist, generate them from post titles
    if (!trendingTopics || trendingTopics.length === 0) {
      console.log('No trending topics found, generating from posts...');
      
      // Get all posts
      const posts = await CommunityForum.find()
        .sort({ likes: -1, commentCount: -1 })
        .limit(20);
      
      // Extract titles and create trending topics
      const topicPromises = posts.map(async (post) => {
        const newTopic = new TrendingTopic({
          title: post.title,
          count: post.likes + post.commentCount,
          lastUpdated: new Date()
        });
        return await newTopic.save();
      });
      
      // Wait for all topics to be created
      await Promise.all(topicPromises);
      
      // Fetch the newly created trending topics
      trendingTopics = await TrendingTopic.find()
        .sort({ count: -1, lastUpdated: -1 })
        .limit(5);
    }
    
    // Map to simpler format for the frontend
    const topics = trendingTopics.map(topic => topic.title);
    
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return NextResponse.json({ 
      error: 'Failed to fetch trending topics',
      details: error.message 
    }, { status: 500 });
  }
}

// Function to update trending topics when a post is created or updated
export async function updateTrendingTopic(title: string) {
  try {
    await dbConnect();
    
    // Check if topic already exists
    const existingTopic = await TrendingTopic.findOne({ title });
    
    if (existingTopic) {
      // Update existing topic
      existingTopic.count += 1;
      existingTopic.lastUpdated = new Date();
      await existingTopic.save();
    } else {
      // Create new topic
      const newTopic = new TrendingTopic({
        title,
        count: 1,
        lastUpdated: new Date()
      });
      await newTopic.save();
    }
  } catch (error) {
    console.error("Error updating trending topic:", error);
  }
}

import mongoose from 'mongoose';
