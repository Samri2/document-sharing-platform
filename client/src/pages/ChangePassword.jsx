import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("emailToChange");

  const handleChange = async () => {
    if (!password || !confirm) return alert("Enter both fields");
    if (password !== confirm) return alert("Passwords do not match");

    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully");
        localStorage.removeItem("emailToChange");
        navigate("/login");
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-8 shadow rounded w-96">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 mb-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 mb-4 w-full"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleChange}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
