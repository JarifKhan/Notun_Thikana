import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Villa from '@/models/house'; // assuming your Mongoose model is here

// GET all villas
export async function GET() {
  try {
    await dbConnect();
    const villas = await Villa.find({});
    return new Response(JSON.stringify(villas), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch villas' }), {
      status: 500,
    });
  }
}

// POST new villa
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newVilla = await Villa.create(body);
    return new Response(JSON.stringify(newVilla), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create villa' }), {
      status: 500,
    });
  }
}
