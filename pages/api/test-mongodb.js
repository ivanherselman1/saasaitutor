import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix'); // Specify the database name

    // Query the 'comments' collection
    const comments = await db.collection('comments').find({}).limit(10).toArray();

    // Return the fetched data
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}
