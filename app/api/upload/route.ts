import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: `${Date.now()}-${file.name}`,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  };

  try {
    const result = await s3.upload(params).promise();
    return NextResponse.json({ url: result.Location });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}