/* eslint-disable react-hooks/exhaustive-deps, no-undef */
// Global variables __app_id, __firebase_config, __initial_auth_token are injected by the Canvas runtime.
// Disabling 'no-undef' for global variables and 'exhaustive-deps' only for the useEffects where the linter might get confused by the environment.

import React, { useState, useMemo, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
// Importing all necessary Firestore functions, including onSnapshot, for real-time data
import { getFirestore, doc, collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp, runTransaction } from 'firebase/firestore'; 

// --- Inline SVG Icons (Lucide Icons) ---
const IconShield = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const IconUsers = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconBarChart2 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
const IconSettings = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 0-.77 3.6v.44a2 2 0 0 0 2 2h.18a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 0 3.6.77l.44-.43a2 2 0 0 1 1-1.73v-.18a2 2 0 0 0 2-2h.18a2 2 0 0 0 1-1.73l.25-.43a2 2 0 0 0-.77-3.6l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>);
const IconLogOut = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const IconMenu = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const IconX = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconFolder = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>);
const IconFileText = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>);
const IconPlus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconEdit = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>);
const IconTrash2 = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>);
const IconHardDrive = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>);


// --- Fallback Configuration for Local Development ---
const MOCK_FIREBASE_CONFIG = JSON.stringify({
  apiKey: "MOCK_API_KEY",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "MOCK_ID",
  appId: "MOCK_APP_ID"
});

// --- Global Variable Access ---
const ENV_APP_ID = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
const ENV_FIREBASE_CONFIG_JSON = typeof window.__firebase_config !== 'undefined' ? window.__firebase_config : MOCK_FIREBASE_CONFIG;
const ENV_INITIAL_AUTH_TOKEN = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;

// Firebase collections paths (Public data for the admin to manage)
const COLLECTIONS = {
  USERS: `artifacts/${ENV_APP_ID}/public/data/platform_users`,
  DOCUMENTS: `artifacts/${ENV_APP_ID}/public/data/platform_documents`,
};


// --- Core Components ---

/**
 * AdminSidebar Component
 */
const AdminSidebar = ({ activeRoute, setActiveRoute, setIsMenuOpen, userId }) => {
  const navItems = [
    { name: 'Dashboard', icon: IconBarChart2, route: 'dashboard' },
    { name: 'Users', icon: IconUsers, route: 'users' },
    { name: 'Documents', icon: IconFolder, route: 'documents' },
    { name: 'Settings', icon: IconSettings, route: 'settings' },
  ];

  const handleNavigation = (route) => {
    setActiveRoute(route);
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4">
      <div className="text-2xl font-extrabold flex items-center mb-10 text-indigo-400">
        <IconShield className="w-6 h-6 mr-2" />
        ShareVault Admin
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <button
            key={item.route}
            onClick={() => handleNavigation(item.route)}
            className={`flex items-center w-full p-3 rounded-xl transition duration-200 ${
              activeRoute === item.route
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="mt-8 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 mb-2 truncate">Admin ID: {userId || 'Authenticating...'}</p>
        <button
          className="flex items-center w-full p-3 rounded-xl text-red-400 hover:bg-red-900/50 transition duration-200"
          onClick={() => console.log('Simulated Logout')}
        >
          <IconLogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

/**
 * StatCard Component
 */
const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className={`p-5 rounded-2xl shadow-lg ${color} text-white`}>
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Icon className="w-6 h-6 opacity-80" />
    </div>
    <p className="text-4xl font-extrabold mt-2">{value}</p>
    <p className="text-sm mt-1">{change}</p>
  </div>
);

/**
 * Dashboard Content
 */
const DashboardContent = ({ users, documents }) => {
  const totalUsers = users.length;
  const totalFiles = documents.filter(d => d.type === 'file').length;
  const totalFolders = documents.filter(d => d.type === 'folder').length;
  const totalSize = documents.reduce((acc, doc) => acc + (doc.size || 0), 0);
  
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Platform Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={totalUsers} change={`Active: ${totalUsers}`} icon={IconUsers} color="bg-blue-500" />
        <StatCard title="Total Files" value={totalFiles} change={`Folders: ${totalFolders}`} icon={IconFileText} color="bg-green-500" />
        <StatCard title="Total Storage" value={formatSize(totalSize)} change="Simulated data" icon={IconHardDrive} color="bg-yellow-500" />
        <StatCard title="Admin ID" value={ENV_APP_ID.slice(0, 8) + '...'} change="App Identifier" icon={IconShield} color="bg-indigo-500" />
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-700 mt-8">Latest Registered Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition duration-150">
                <td className="p-4 text-gray-700 font-medium">{user.name}</td>
                <td className="p-4 text-gray-700">{user.role}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
                 <tr><td colSpan="3" className="p-4 text-center text-gray-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * User Management (UsersContent)
 */
const UsersContent = ({ db, isAuthReady, users }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Standard');
  const [status, setStatus] = useState('Active');
  const [currentEdit, setCurrentEdit] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentEdit) {
      setName(currentEdit.name || '');
      setEmail(currentEdit.email || '');
      setRole(currentEdit.role || 'Standard');
      setStatus(currentEdit.status || 'Active');
    } else {
      setName('');
      setEmail('');
      setRole('Standard');
      setStatus('Active');
    }
    setError('');
  }, [currentEdit]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthReady || !db) return;
    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }

    try {
      const userRef = collection(db, COLLECTIONS.USERS);
      const data = { name, email, role, status, updated_at: serverTimestamp() };

      if (currentEdit) {
        await updateDoc(doc(db, COLLECTIONS.USERS, currentEdit.id), data);
        console.log('User updated:', currentEdit.id);
        setCurrentEdit(null);
      } else {
        await addDoc(userRef, { ...data, created_at: serverTimestamp() });
        console.log('User added.');
      }
      setName('');
      setEmail('');
      setError('');
    } catch (e) {
      console.error('Error submitting user:', e);
      setError('Failed to save user. Check console for details.');
    }
  };

  const handleDelete = async (user) => {
    if (!isAuthReady || !db) return;
    // NOTE: Using console.log instead of window.confirm for security/iframe limitations
    console.log(`ATTENTION: Simulated delete confirmation for user ${user.name}.`);
    
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, user.id));
      console.log('User deleted:', user.id);
    } catch (e) {
      console.error('Error deleting user:', e);
      setError('Failed to delete user.');
    }
  };

  const handleEdit = (user) => {
    setCurrentEdit(user);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
      <p className="text-gray-600">Create, edit, and delete user accounts.</p>

      {/* User Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">{currentEdit ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 col-span-1"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 col-span-1"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 col-span-1"
          >
            <option value="Standard">Auditor</option>
            <option value="Admin">Admin</option>
  
          </select>
          <button
            type="submit"
            className="flex items-center justify-center p-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-200 shadow-md col-span-1"
          >
            <IconPlus className="w-5 h-5 mr-1" />
            {currentEdit ? 'Update User' : 'Add User'}
          </button>
        </form>
        {error && <p className="mt-3 text-red-500 font-medium">{error}</p>}
        {currentEdit && (
            <button
              onClick={() => setCurrentEdit(null)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel Edit
            </button>
          )}
      </div>

      {/* User Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Existing Users ({users.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition duration-150">
                  <td className="p-4 text-gray-700 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-700">{user.email}</td>
                  <td className="p-4 text-gray-700">{user.role}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2 flex">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-500 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-100 transition"
                      title="Edit User"
                    >
                      <IconEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                      title="Delete User"
                    >
                      <IconTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No user accounts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


/**
 * Document/Folder Management (DocumentsContent)
 */
const DocumentsContent = ({ db, isAuthReady, documents }) => {
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [newEntryName, setNewEntryName] = useState('');
  const [error, setError] = useState('');

  // Memoize the hierarchical structure for the current view
  const currentView = useMemo(() => {
    // Determine current path for breadcrumbs
    const path = [];
    let current = currentFolderId;
    while (current !== 'root') {
      const folder = documents.find(d => d.id === current);
      if (!folder || documents.length === 0) break; 
      current = folder.parent_id;
      path.unshift(folder);
    }

    // Filter documents for the current folder
    const contents = documents
      .filter(doc => doc.parent_id === currentFolderId)
      .sort((a, b) => a.type === 'folder' && b.type !== 'folder' ? -1 : a.type !== 'folder' && b.type === 'folder' ? 1 : a.name.localeCompare(b.name));
    
    return { path, contents };
  }, [documents, currentFolderId]); 

  const handleCreateEntry = async (type) => {
    if (!isAuthReady || !db || !newEntryName) {
      setError('Authentication not ready or name is missing.');
      return;
    }
    setError('');

    try {
      const docRef = collection(db, COLLECTIONS.DOCUMENTS);
      const data = {
        name: newEntryName,
        type: type,
        parent_id: currentFolderId,
        created_at: serverTimestamp(),
        size: type === 'file' ? Math.floor(Math.random() * 500000) : 0, // Simulate file size
      };
      
      await addDoc(docRef, data);
      setNewEntryName('');
      console.log(`${type} created: ${newEntryName}`);
    } catch (e) {
      console.error(`Error creating ${type}:`, e);
      setError(`Failed to create ${type}.`);
    }
  };
  
  const handleDeleteEntry = async (entry) => {
    if (!isAuthReady || !db) return;
    // NOTE: Using console.log instead of window.confirm for security/iframe limitations
    console.log(`ATTENTION: Simulated delete confirmation for ${entry.name}.`);
    
    try {
      // Use transaction to ensure both folder and potential children are handled atomically
      await runTransaction(db, async (transaction) => {
        // 1. Delete the entry itself
        const entryRef = doc(db, COLLECTIONS.DOCUMENTS, entry.id);
        transaction.delete(entryRef);

        // 2. If it's a folder, recursively delete all immediate children documents 
        // to prevent orphaning (note: for deep deletion in Firestore, 
        // a more complex server-side function is usually needed, but this handles immediate children).
        if (entry.type === 'folder') {
          const children = documents.filter(d => d.parent_id === entry.id);
          children.forEach(child => {
            const childRef = doc(db, COLLECTIONS.DOCUMENTS, child.id);
            transaction.delete(childRef);
          });
          console.warn(`NOTE: Deleting immediate children of folder ${entry.name} within the transaction.`);
        }
      });
      console.log(`${entry.type} deleted: ${entry.name}`);
    } catch (e) {
      console.error(`Error deleting ${entry.type}:`, e);
      setError(`Failed to delete ${entry.type}.`);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Document Management</h2>
      <p className="text-gray-600">Organize and manage shared files and folders.</p>

      {/* Action Bar */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="New folder or file name..."
          value={newEntryName}
          onChange={(e) => setNewEntryName(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
        />
        <button
          onClick={() => handleCreateEntry('folder')}
          className="flex items-center justify-center p-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-200 shadow-md min-w-[150px]"
        >
          <IconFolder className="w-5 h-5 mr-1" /> Add Folder
        </button>
        <button
          onClick={() => handleCreateEntry('file')}
          className="flex items-center justify-center p-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition duration-200 shadow-md min-w-[150px]"
        >
          // CORRECTED CODE SNIPPET
<IconFileText className="w-5 h-5 mr-1" /> Upload File (Simulated) {/* <--- CORRECTED HERE */}
        </button>
      </div>
      {error && <p className="mt-3 text-red-500 font-medium">{error}</p>}
      
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <button 
            onClick={() => setCurrentFolderId('root')} 
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
            Root
        </button>
        {currentView.path.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <span>/</span>
            <button
              onClick={() => setCurrentFolderId(folder.id)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>
          
      {/* Documents Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Contents: {currentFolderId === 'root' ? 'Root' : currentView.path[currentView.path.length - 1]?.name} ({currentView.contents.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Size</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Date Added</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentView.contents.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50 transition duration-150 cursor-pointer">
                  <td
                    className="p-4 text-gray-700 font-medium flex items-center"
                    onClick={() => entry.type === 'folder' && setCurrentFolderId(entry.id)}
                  >
                    {entry.type === 'folder' ? (
                      <IconFolder className="w-5 h-5 mr-3 text-indigo-500" />
                    ) : (
                      <IconFileText className="w-5 h-5 mr-3 text-green-500" />
                    )}
                    {entry.name}
                  </td>
                  <td className="p-4 text-gray-700">{entry.type}</td>
                  <td className="p-4 text-gray-700">{formatSize(entry.size)}</td>
                  <td className="p-4 text-gray-700">
                      {entry.created_at?.toDate()?.toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleDeleteEntry(entry)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                      title={`Delete ${entry.type}`}
                    >
                      <IconTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {currentView.contents.length === 0 && (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">This folder is empty.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Data state
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);

  // 1. Initialize Firebase and Auth
  useEffect(() => {
    let firebaseConfig;
    try {
        // Attempt to parse config from global environment variable
        firebaseConfig = ENV_FIREBASE_CONFIG_JSON ? JSON.parse(ENV_FIREBASE_CONFIG_JSON) : null;
    } catch (e) {
        console.error("Failed to parse Firebase config JSON:", e);
        return;
    }

    if (!firebaseConfig) {
      console.error("Firebase config is missing or invalid.");
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authentication = getAuth(app);
      setDb(firestore);

      // Set up auth listener first
      const unsubscribeAuth = onAuthStateChanged(authentication, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
        // Mark auth ready after the initial check is complete
        setIsAuthReady(true);
      });

      // Attempt initial sign-in (Canvas token or Anonymous)
      const attemptSignIn = async () => {
        try {
          if (ENV_INITIAL_AUTH_TOKEN) {
            await signInWithCustomToken(authentication, ENV_INITIAL_AUTH_TOKEN);
          } else {
            await signInAnonymously(authentication);
          }
        } catch (e) {
          console.error("Failed to sign in:", e);
        }
      };
      attemptSignIn();
      
      return () => unsubscribeAuth();
    } catch (e) {
      console.error("Firebase initialization failed:", e);
    }
  }, []); 

  // 2. Fetch Users (Real-time listener)
  // Uses 'onSnapshot' (imported from firebase/firestore) and state variables 'isAuthReady' and 'db' (defined in App scope)
  useEffect(() => {
    if (!isAuthReady || !db) return;

    const usersQuery = query(collection(db, COLLECTIONS.USERS));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => unsubscribe();
  }, [isAuthReady, db]);

  // 3. Fetch Documents/Folders (Real-time listener)
  // Uses 'onSnapshot' (imported from firebase/firestore) and state variables 'isAuthReady' and 'db' (defined in App scope)
  useEffect(() => {
    if (!isAuthReady || !db) return;

    const docsQuery = query(collection(db, COLLECTIONS.DOCUMENTS));
    const unsubscribe = onSnapshot(docsQuery, (snapshot) => {
      const fetchedDocuments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(fetchedDocuments);
    }, (error) => {
      console.error("Error fetching documents:", error);
    });

    return () => unsubscribe();
  }, [isAuthReady, db]);

  // 4. Content Renderer
  const renderContent = useMemo(() => {
    if (!isAuthReady) {
      return (
        <div className="text-center p-20 bg-white rounded-xl shadow-2xl">
          <p className="text-xl font-medium text-indigo-600">
            <svg className="animate-spin inline-block w-6 h-6 mr-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Connecting to ShareVault...
          </p>
          <p className="text-gray-500 mt-2">Waiting for secure authentication and data sync.</p>
        </div>
      );
    }

    switch (activeRoute) {
      case 'dashboard':
        return <DashboardContent users={users} documents={documents} />;
      case 'users':
        return <UsersContent db={db} isAuthReady={isAuthReady} users={users} />;
      case 'documents':
        return <DocumentsContent db={db} isAuthReady={isAuthReady} documents={documents} />;
      case 'settings':
        return <div className="p-6 bg-white rounded-xl shadow-2xl"><h2 className="text-3xl font-bold">Settings</h2><p>Admin configuration options go here.</p></div>;
      default:
        return <DashboardContent users={users} documents={documents} />;
    }
  }, [activeRoute, isAuthReady, db, users, documents]); 

  // Handle body overflow for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]); 


  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Mobile Menu Button */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          {isMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block w-64 flex-shrink-0 shadow-2xl">
        <AdminSidebar activeRoute={activeRoute} setActiveRoute={setActiveRoute} setIsMenuOpen={setIsMenuOpen} userId={userId} />
      </div>

      {/* Sidebar (Mobile Overlay) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 h-full bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <AdminSidebar activeRoute={activeRoute} setActiveRoute={setActiveRoute} setIsMenuOpen={setIsMenuOpen} userId={userId} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header/Title Area */}
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 hidden lg:block">
              {activeRoute.charAt(0).toUpperCase() + activeRoute.slice(1).replace('_', ' ')}
            </h1>
            <p className="text-gray-500 hidden lg:block">Welcome back to your document management system.</p>
          </header>

          {/* Render Current Page Content */}
          {renderContent}
        </div>
      </main>
    </div>
  );
};

export default App;