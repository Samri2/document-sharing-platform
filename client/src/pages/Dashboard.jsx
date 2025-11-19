import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocViewer from "../components/DocViewer";



export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // ✨ Get token

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documents, setDocuments] = useState([]); 

  // ✅ Protect auditor route
  useEffect(() => {
    // ✨ FIX: Check for token AND role
    if (!token || !user || user.role !== "auditor") navigate("/login");
  }, [navigate, user, token]);

  // ✅ Fetch documents from backend
  useEffect(() => {
    // ✨ FIX: Corrected API endpoint
    fetch("http://localhost:5000/api/documents", {
        headers: { 'Authorization': `Bearer ${token}` } // ✨ Add Auth Header
    })
      .then((res) => res.json())
      .then((data) => {
        // Data is { folders: [...] }, so we must extract files
        const allFiles = data.folders.flatMap(folder => folder.files || []);
        setDocuments(allFiles);
      })
      .catch((err) => console.error("Error fetching docs:", err));
  }, [token]);

  

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Auditor Panel</h2>
        {/* Future Nav Links can go here */}
        <button
          className="mt-auto bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
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
                    <span>{doc.title}</span>
                    <span className="text-sm text-gray-500">View ➜</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <DocViewer
            title={selectedDoc.title}
            fileUrl={`http://localhost:5000${selectedDoc.fileUrl}`}
          />
        )}
      </div>
    </div>
  );
}
