// components/DocViewer.js

import { useState, useEffect } from 'react';

export default function DocViewer({ selectedDoc }) {
  const [fileUrl, setFileUrl] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Clear previous URL when a new doc is selected or deselected
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }

    if (selectedDoc && token) {
      // ✨ FIX: Fetch the file from the SECURE endpoint
      fetch(`http://localhost:5000/api/documents/view/${selectedDoc.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('File not found or unauthorized');
        return res.blob(); // Get the file data as a Blob
      })
      .then(blob => {
        // Create a temporary URL for the browser to display the blob
        const objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      })
      .catch(err => {
        console.error("Error fetching file:", err);
        setFileUrl(null); // Clear URL on error
      });
    }

    // Cleanup function to revoke the URL when the component unmounts
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [selectedDoc, token]); // Re-run if the selected doc changes


  if (!selectedDoc) {
    return (
      <div className="p-6 text-gray-500">
        <p>Select a document to view</p>
      </div>
    );
  }

  // Determine file type from its original name
  const isPDF = selectedDoc.title.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(selectedDoc.title);

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-2">{selectedDoc.title}</h3>
      
      {!fileUrl ? (
        <p>Loading document...</p>
      ) : isPDF ? (
        <iframe
          src={fileUrl} // ✨ Use the secure, temporary blob URL
          title="PDF Viewer"
          className="w-full h-[600px] border rounded"
        ></iframe>
      ) : isImage ? (
        <img
          src={fileUrl} // ✨ Use the secure, temporary blob URL
          alt={selectedDoc.title}
          className="max-h-[600px] rounded"
        />
      ) : (
        <a
          href={fileUrl}
          download={selectedDoc.title} // Allow download for other file types
          className="text-blue-600 underline"
        >
          Download File (Unsupported Preview)
        </a>
      )}
    </div>
  );
}