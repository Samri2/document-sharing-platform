import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white px-10 py-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Audit Doc Portal</h1>
      <div className="space-x-6">
        <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
        <button onClick={handleLogout} className="hover:text-gray-200">
          Logout
        </button>
      </div>
    </nav>
  );
}
