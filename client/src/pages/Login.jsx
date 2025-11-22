import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forceChange, setForceChange] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") navigate("/admin");
      if (user?.role === "auditor") navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch(`
https://document-sharing-platform-3.onrender.com/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.forcePasswordChange) {
          localStorage.setItem("emailToChange", data.email);
          setForceChange(true);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem(
            "user",
            JSON.stringify({ email, role: data.role })
          );

          if (data.role === "admin") navigate("/admin");
          else if (data.role === "auditor") navigate("/dashboard");
          else setError("Login successful, but user role is unknown.");
        }
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  const handleChangePassword = async () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const emailToChange = localStorage.getItem("emailToChange");
    if (!emailToChange) {
      setError("Session expired. Please go back to login.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToChange, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully, please login again.");
        localStorage.removeItem("emailToChange");
        setForceChange(false);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to change password.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-10">
      {!forceChange ? (
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 mb-4 w-full rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 mb-4 w-full rounded"
          />

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center text-yellow-700 mb-4">
            Please Update Your Password
          </h2>

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-3 mb-4 w-full rounded"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-3 mb-4 w-full rounded"
          />

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleChangePassword}
            className="w-full bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600 transition"
          >
            Update Password
          </button>
        </div>
      )}
    </div>
  );
}
