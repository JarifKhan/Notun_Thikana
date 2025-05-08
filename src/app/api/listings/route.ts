// pages/api/listings/create.js
import dbConnect from '@/lib/dbConnect';
import Listing from '@/models/listing';
import User from '@/models/user';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  try {
    const newListing = await Listing.create(req.body);

    const users = await User.find();

    const notification = {
      message: `New house listed: ${newListing.title}`,
      type: 'new_listing',
      listingId: newListing._id,
    };

    await Promise.all(users.map(user => {
      user.notifications.push(notification);
      return user.save();
    }));

    res.status(201).json({ success: true, listing: newListing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
