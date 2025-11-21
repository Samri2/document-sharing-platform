import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [password, setPassword] = useState("");
  const emailToChange = localStorage.getItem("emailToChange");

  if (!emailToChange) {
    navigate("/login");
  }

  const handleChangePassword = async () => {
    if (!password) return alert("Enter a password!");

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToChange, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Password change failed");
        return;
      }

      alert("Password updated! Please log in again.");

      // cleanup
      localStorage.removeItem("emailToChange");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Password change error:", error);
      alert("Network error.");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Change Your Password</h2>

      <input
        type="password"
        placeholder="New Password"
        className="border p-2 rounded w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleChangePassword}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Update Password
      </button>
    </div>
  );
}
