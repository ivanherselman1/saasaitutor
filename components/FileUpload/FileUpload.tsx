"use client";
import React, { useState } from 'react';
import { uploadToS3 } from '../../lib/uploadToS3';

// Add this interface definition
interface ExtractResponse {
  text?: string;
  error?: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploadStatus('Uploading...');
      const fileUrl = await uploadToS3(file);
      setUploadStatus(`File uploaded successfully! File URL: ${fileUrl}`);
      
      // Extract text from the uploaded PDF
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json() as ExtractResponse;
      
      if (!response.ok) {
        console.error('Error response from server:', data);
        throw new Error(data.error || 'Failed to extract text from PDF');
      }
      
      if (data.text) {
        setExtractedText(data.text);
      } else {
        throw new Error('No text found in the document');
      }
    } catch (error) {
      console.error('Error uploading file or extracting text:', error);
      setUploadStatus(error instanceof Error ? error.message : 'File upload or text extraction failed.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload a document</h2>
      <input 
        type="file" 
        accept="application/pdf" 
        onChange={handleFileChange} 
        className="mb-4 border p-2 w-full"
      />
      <button 
        onClick={handleUpload} 
        disabled={!file} 
        className={`w-full p-3 text-white rounded ${file ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        Upload and Extract Text
      </button>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
      {extractedText && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Extracted Text:</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{extractedText}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
