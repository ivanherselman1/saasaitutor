import { NextResponse } from 'next/server';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

// You'll need to replace these with your actual values 411eeef7846b9ee
const projectId = 'aitutorauth';
const location = 'us'; // e.g., 'us' or 'eu'
const processorId = '9e776f27a2bb14cb';

const client = new DocumentProcessorServiceClient({
  keyFilename: process.env.GOOGLE_VISION_CREDENTIALS,
});

const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB limit

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      console.error('Uploaded file is not a PDF');
      return NextResponse.json({ error: 'Uploaded file must be a PDF' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      console.error('File size exceeds limit');
      return NextResponse.json({ error: 'File size must not exceed 5 MB' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString('base64');

    const [result] = await client.processDocument({
      name,
      rawDocument: {
        content: base64Content,
        mimeType: 'application/pdf',
      },
      // Add any necessary processor-specific configurations here
    });

    console.log('Document AI processing complete');

    const { document } = result;

    if (!document || !document.text) {
      console.error('No text found in the document');
      return NextResponse.json({ error: 'No text found in the document' }, { status: 400 });
    }

    console.log('Text extracted successfully');
    return NextResponse.json({ text: document.text });
  } catch (error: unknown) {
    console.error('Error extracting text from PDF:', error);
    let errorMessage = 'Failed to extract text from PDF';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      console.error('Error details:', error);
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

