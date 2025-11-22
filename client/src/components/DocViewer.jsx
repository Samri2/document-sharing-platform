// components/DocViewer.js
import { useState, useEffect } from "react";

export default function DocViewer({ selectedDoc }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
   const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!selectedDoc || !token) return;

    setLoading(true);
    setError(null);

    // Clear previous URL
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }

    const fetchFile = async () => {
      try {
        // Use the download endpoint to get the file blob
        const res = await fetch(`${API_URL}/documents/download/${selectedDoc.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("File not found or unauthorized");

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      } catch (err) {
        console.error("Error fetching file:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    // Cleanup: revoke object URL on unmount or doc change
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [selectedDoc, token, API_URL]);

  if (!selectedDoc) {
    return (
      <div className="p-6 text-gray-500">
        <p>Select a document to view</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        <p>Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Determine file type
  const isPDF = selectedDoc.title.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(selectedDoc.title);

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-2">{selectedDoc.title}</h3>

      {isPDF ? (
        <iframe
          src={fileUrl}
          title="PDF Viewer"
          className="w-full h-[600px] border rounded"
        />
      ) : isImage ? (
        <img
          src={fileUrl}
          alt={selectedDoc.title}
          className="max-h-[600px] rounded"
        />
      ) : (
        <a
          href={fileUrl}
          download={selectedDoc.title}
          className="text-blue-600 underline"
        >
          Download File (Unsupported Preview)
        </a>
      )}
    </div>
  );
}
