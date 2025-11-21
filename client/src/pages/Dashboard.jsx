import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocViewer from "../components/DocViewer";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // JWT token from login

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documents, setDocuments] = useState([]); // flattened files

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Redirect if not auditor
  useEffect(() => {
    if (!token || !user || user.role !== "auditor") {
      navigate("/login");
    }
  }, [navigate, user, token]);

  // Fetch folders and files from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/getAllDocuments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Error fetching folders/files:", errData.message || res.statusText);
          setDocuments([]);
          return;
        }

        const data = await res.json();
        // Flatten all files across folders
        const allFiles = (data.folders || []).flatMap((folder) =>
          (folder.files || []).map((file) => ({
            ...file,
            folderName: folder.name, // keep folder name
          }))
        );
        setDocuments(allFiles);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setDocuments([]);
      }
    };

    fetchDocuments();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Auditor Panel</h2>
        <button
          className="mt-auto bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-10 bg-gray-50">
        {!selectedDoc ? (
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">📚 Documents</h2>

            {documents.length === 0 ? (
              <p className="text-gray-500">No documents found.</p>
            ) : (
              <ul className="space-y-3">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="p-4 bg-white shadow rounded-lg flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div>
                      <span className="font-medium">{doc.title}</span>
                      <span className="text-sm text-gray-400 ml-2">
                        ({doc.folderName})
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">View ➜</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <DocViewer
            title={selectedDoc.title}
            fileUrl={`${API_URL}/api/documents/download/${selectedDoc.id}`}
          />
        )}
      </div>
    </div>
  );
}
