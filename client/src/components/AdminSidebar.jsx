import React from "react";
const user = JSON.parse(localStorage.getItem("user"));


export default function AdminSidebar({ activeTab, setActiveTab, handleLogout }) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
  <span className=" text-gray-500">Hello, {user?.email}</span>
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <button
        className={`mb-2 ${activeTab === "docs" ? "bg-gray-700" : ""} w-full text-left px-3 py-2 rounded`}
        onClick={() => setActiveTab("docs")}
      >
        Documents
      </button>
      <button
        className={`mb-2 ${activeTab === "users" ? "bg-gray-700" : ""} w-full text-left px-3 py-2 rounded`}
        onClick={() => setActiveTab("users")}
      >
        Users
      </button>

      {/* ✅ Logout button */}
      <button
        className="mt-auto bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
