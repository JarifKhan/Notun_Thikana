import { NextResponse } from 'next/server';
import CommunityForum from '@/models/forum';
import dbConnect from "@/lib/dbConnect";
import { updateTrendingTopic } from '../trending/route';

await dbConnect();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        if (id) {
            const post = await CommunityForum.findById(id);
            if (!post) {
                return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            }
            return NextResponse.json(post);
        }

        const posts = await CommunityForum.find();
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const newPost = await CommunityForum.create(data);

        // Update trending topics with the new post title
        if (data.title) {
            await updateTrendingTopic(data.title);
        }

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({
            error: 'Failed to create post',
            details: error.message
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...updateData } = await req.json();
        const updatedPost = await CommunityForum.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        const deletedPost = await CommunityForum.findByIdAndDelete(id);

        if (!deletedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(deletedPost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
