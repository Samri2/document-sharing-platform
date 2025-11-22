import { useState, useEffect } from "react";
import DocViewer from "../components/DocViewer";
import { API_BASE } from "../api";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");}; // send user to login page
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch(`${API_BASE}/documents/getAllDocuments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch folders/files");
        const data = await res.json();
        setFolders(data.folders || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFolders();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-50">
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

      {/* Main */}
      <div className="flex-1 p-8">
        {!selectedDoc ? (
          <>
            <h2 className="text-3xl font-bold text-blue-700 mb-6">📚 Documents</h2>

            <input
              type="text"
              placeholder="Search folders or files..."
              className="mb-4 p-2 rounded border w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Folder Name</th>
                    <th className="py-2 px-4 text-left">File Name</th>
                    <th className="py-2 px-4 text-left">Owner</th>
                    <th className="py-2 px-4 text-left">Size (KB)</th>
                    <th className="py-2 px-4 text-left">Created At</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {folders
                    .filter(folder => 
                      folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      folder.files.some(f => f.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map(folder =>
                      folder.files.map(file => (
                        <tr key={file.id} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-4">{folder.name}</td>
                          <td className="py-2 px-4">{file.title}</td>
                          <td className="py-2 px-4">{file.owner?.email || "N/A"}</td>
                          <td className="py-2 px-4">{(file.sizeBytes / 1024).toFixed(2)}</td>
                          <td className="py-2 px-4">{new Date(file.createdAt).toLocaleString()}</td>
                          <td className="py-2 px-4">
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => setSelectedDoc({ ...file, folderName: folder.name })}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <DocViewer
            selectedDoc={selectedDoc}
            onClose={() => setSelectedDoc(null)}
          />
        )}
      </div>
    </div>
  );
}
