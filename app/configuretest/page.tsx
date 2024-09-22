import React from 'react';
import FileUpload from '../../components/FileUpload/FileUpload';

export default function ConfigureTest() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configure Test Page</h1>
      <FileUpload />
    </div>
  );
}
