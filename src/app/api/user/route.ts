// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const { name, email, password, notifications = [] } = body;

  // Basic validation
  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Name, email, and password are required.' }, { status: 400 });
  }

  // Validate notifications schema
  for (const notification of notifications) {
    const { title, message, type, listingId, isRead, createdAt, description, time, urgency, image, actions } = notification;

    if (!title || !message || !type) {
      return NextResponse.json({ message: 'Each notification must have a title, message, and type.' }, { status: 400 });
    }

    if (!type || !['bid', 'rental', 'announcement', 'listing'].includes(type)) {
      return NextResponse.json({ message: `Invalid or missing notification type: ${type}.` }, { status: 400 });
    }

    if (urgency && !['regular', 'urgent'].includes(urgency)) {
      return NextResponse.json({ message: `Invalid urgency value: ${urgency}.` }, { status: 400 });
    }
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      notifications
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const users = await User.find({}).select('-password'); // Exclude password from the response
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const { id, name, email, password, notifications } = body;

  // Basic validation
  if (!id) {
    return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, notifications },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}