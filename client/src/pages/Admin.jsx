import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("docs");
  const [folders, setFolders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!token || !user) navigate("/login");
    else if (user.role !== "admin") {
      alert("Access Denied: Admin role required.");
      navigate("/login");
    }
  }, [navigate, user, token]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("emailToChange");
    navigate("/login");
  };

  // Fetch folders with files
  const fetchFolders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setFolders(data.folders || []);
      else console.error(data.message);
    } catch (err) {
      console.error("Error fetching folders:", err);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.users)) setUsers(data.users);
      else console.error(data.message || "Failed to fetch users");
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "docs") fetchFolders();
    if (activeTab === "users") fetchUsers();
  }, [activeTab, token]);

  // Folder operations
  const createFolderBackend = async (name) => {
    if (!name) return alert("Folder name required!");
    try {
      const res = await fetch(`${API_URL}/api/documents/create-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, parentFolderId: null }),
      });
      const data = await res.json();
      if (res.ok) {
        setFolders((prev) => [...prev, data.folder]);
        alert("Folder created successfully!");
        setNewFolderName("");
      } else alert(data.message || "Failed to create folder");
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };

  const deleteFolderBackend = async (folderId) => {
    if (!window.confirm("Delete this folder and all files inside?")) return;
    try {
      const res = await fetch(`${API_URL}/api/documents/delete-folder/${folderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFolders((prev) => prev.filter((f) => f.id !== folderId));
        alert("Folder deleted!");
      }
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  // File operations
  const uploadFileBackend = async (folderId, file) => {
    if (!file) return alert("Select a file to upload!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId || null);
    try {
      const res = await fetch(`${API_URL}/api/documents/upload`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        fetchFolders();
        alert("File uploaded successfully!");
        setSelectedFile(null);
      } else alert(data.message || "Upload failed");
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const deleteFileBackend = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      const res = await fetch(`${API_URL}/api/documents/delete-file/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchFolders();
        alert("File deleted!");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  // User management functions
  const addUser = async (email, role) => {
    if (!email || !role) return alert("Email and role required!");
    try {
      const res = await fetch(`${API_URL}/api/admin/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`User created. Temporary password: ${data.tempPassword}`);
        fetchUsers();
      } else alert(data.message || "Failed to create user");
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const toggleUserActive = async (id, isActive) => {
    const action = isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !isActive } : u)));
        alert(`User ${action}d!`);
      } else alert(data.message || "Failed to update user status");
    } catch (err) {
      console.error("Error toggling user status:", err);
    }
  };

  const updateUserRole = async (id, newRole) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/update-role/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
        alert("Role updated!");
      } else alert(data.message || "Failed to update user role");
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const forceResetPassword = async (id) => {
    if (!window.confirm("Force a password reset for this user?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/reset-password/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(`User password reset. New temporary password: ${data.newTempPassword}`);
        fetchUsers();
      } else alert(data.message || "Failed to reset password");
    } catch (err) {
      console.error("Error forcing reset:", err);
    }
  };

  // --------------------- UI ---------------------
  return (
    <div className="flex min-h-screen">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
      <div className="flex-1 p-10">
        {/* DOCUMENT MANAGEMENT UI */}
        {activeTab === "docs" && (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">📁 Document Management</h2>

            <div className="flex items-center space-x-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <input
                type="text"
                placeholder="New Folder Name"
                className="border p-2 rounded-md flex-1"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => createFolderBackend(newFolderName)}
              >
                Add Folder
              </button>

              <div className="border-l h-8 mx-2"></div>

              {/* Folder selection dropdown */}
              <select
                className="border p-2 rounded-md"
                value={selectedFolderId || ""}
                onChange={(e) => setSelectedFolderId(e.target.value)}
              >
                <option value="">Root</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <input type="file" className="flex-1" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                onClick={() => uploadFileBackend(selectedFolderId, selectedFile)}
                disabled={!selectedFile}
              >
                Upload File
              </button>
            </div>

            <h3 className="text-xl font-semibold mb-3">Folders & Files</h3>
            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-3 text-left w-1/12">Type</th>
                  <th className="border p-3 text-left w-5/12">Name</th>
                  <th className="border p-3 text-left w-2/12">Created By</th>
                  <th className="border p-3 text-left w-2/12">Date</th>
                  <th className="border p-3 text-center w-2/12">Actions</th>
                </tr>
              </thead>
              <tbody>
                {folders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No documents or folders found.
                    </td>
                  </tr>
                ) : (
                  folders.map((folder) => (
                    <React.Fragment key={folder.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="border p-3">📁 Folder</td>
                        <td className="border p-3 font-medium text-blue-700 cursor-pointer hover:underline">{folder.name}</td>
                        <td className="border p-3">{folder.owner?.email || user.email}</td>
                        <td className="border p-3">{new Date(folder.createdAt).toLocaleDateString()}</td>
                        <td className="border p-3 text-center">
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            onClick={() => deleteFolderBackend(folder.id)}
                          >
                            Delete 🗑️
                          </button>
                        </td>
                      </tr>

                      {/* Nested files */}
                      {folder.files && folder.files.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50">
                          <td className="border p-3">📄 File</td>
                          <td className="border p-3">{file.title}</td>
                          <td className="border p-3">{folder.owner?.email || user.email}</td>
                          <td className="border p-3">{new Date(file.createdAt).toLocaleDateString()}</td>
                          <td className="border p-3 text-center space-x-2">
                            <a
                              href={`${API_URL}/api/documents/download/${file.id}`}
                              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            >
                              Download ⬇️
                            </a>
                            <button
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                              onClick={() => deleteFileBackend(file.id)}
                            >
                              Delete 🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* USER MANAGEMENT UI */}
        {activeTab === "users" && (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">👥 User Management</h2>
            <div className="flex space-x-2 mb-6">
              <input type="email" placeholder="User Email" className="border p-2 rounded-md flex-1" id="newUserEmail" />
              <select className="border p-2 rounded-md" id="newUserRole">
                <option value="auditor">Auditor</option>
                <option value="admin">Admin</option>
              </select>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={async () => {
                  const email = document.getElementById("newUserEmail").value;
                  const role = document.getElementById("newUserRole").value;
                  await addUser(email, role);
                  document.getElementById("newUserEmail").value = "";
                }}
              >
                Add User
              </button>
            </div>

            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Must Change Pass</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={`hover:bg-gray-50 ${!u.isActive ? "bg-red-100" : ""}`}>
                    <td className="border p-2">{u.email}</td>
                    <td className="border p-2">
                      <select
                        className="border p-1 rounded"
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                      >
                        <option value="auditor">Auditor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="border p-2">{u.isActive ? "Active" : "Inactive"}</td>
                    <td className="border p-2">{u.forcePasswordChange ? "Yes" : "No"}</td>
                    <td className="border p-2 space-x-2">
                      <button
                        className={`${u.isActive ? "bg-yellow-500" : "bg-green-500"} text-white px-3 py-1 rounded`}
                        onClick={() => toggleUserActive(u.id, u.isActive)}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => forceResetPassword(u.id)}>
                        Force Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
