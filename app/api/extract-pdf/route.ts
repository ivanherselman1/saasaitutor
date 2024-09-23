import { NextResponse } from 'next/server';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { PDFDocument } from 'pdf-lib'; // Import PDFDocument from pdf-lib

// You'll need to replace these with your actual values 411eeef7846b9ee
const projectId = 'aitutorauth';
const location = 'us'; // e.g., 'us' or 'eu'
const processorId = '9e776f27a2bb14cb';

const client = new DocumentProcessorServiceClient({
    keyFilename: process.env.GOOGLE_VISION_CREDENTIALS,
  });
  
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  
  const MAX_PAGES_PER_CHUNK = 15;
  
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
  
      console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type);
  
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pageCount = pdfDoc.getPageCount();
  
      let allText = '';
  
      for (let i = 0; i < pageCount; i += MAX_PAGES_PER_CHUNK) {
        const chunkDoc = await PDFDocument.create();
        const copiedPages = await chunkDoc.copyPages(pdfDoc, Array.from(Array(Math.min(MAX_PAGES_PER_CHUNK, pageCount - i)), (_, index) => i + index));
        copiedPages.forEach(page => chunkDoc.addPage(page));
  
        const chunkPdfBytes = await chunkDoc.save();
        const base64Content = Buffer.from(chunkPdfBytes).toString('base64');
  
        const [result] = await client.processDocument({
          name,
          rawDocument: {
            content: base64Content,
            mimeType: 'application/pdf',
          },
        });
  
        if (result.document && result.document.text) {
          allText += result.document.text + '\n';
        }
      }
  
      if (!allText) {
        console.error('No text found in the document');
        return NextResponse.json({ error: 'No text found in the document' }, { status: 400 });
      }
  
      console.log('Text extracted successfully');
      return NextResponse.json({ text: allText });
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

