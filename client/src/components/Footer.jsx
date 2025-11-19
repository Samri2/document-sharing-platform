import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white text-center py-4 mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} Audit Document Sharing System | Developed by SamSec 🔐
      </p>
    </footer>
  );
}
