import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  console.log('Auth test route is being executed');
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  
  try {
    const client = await clientPromise;
    // Instead of using isConnected, we'll try to ping the database
    await client.db().command({ ping: 1 });
    console.log('MongoDB connection successful');
    return NextResponse.json({ message: 'MongoDB connection successful' });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
  }
}