import React from "react";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-6 text-center text-3xl font-bold shadow-md">
        Audit Document Sharing Platform
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-4">
        <h1 className="text-4xl font-semibold text-blue-700">
          Welcome to the Audit Document Portal
        </h1>
        <p className="text-gray-600 max-w-xl">
          Securely access audit-related policies, directives, and procedures.
          Only authorized staff can view the documents.
        </p>
        <a
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Go to Login
        </a>
      </main>

      <Footer />
    </div>
  );
}
