import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Plus, Lock, Globe, Copy, Eye, EyeOff, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Password } from '../types/password';
import { encrypt, decrypt, generatePassword } from '../utils/encryption';

const MASTER_KEY = 'your-master-key'; // In production, this should be securely stored

export default function Dashboard() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [newPassword, setNewPassword] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    category: 'Personal',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'personal', name: 'Personal', color: 'blue' },
    { id: 'work', name: 'Work', color: 'green' },
    { id: 'finance', name: 'Finance', color: 'purple' },
  ];

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    const { data: passwords, error } = await supabase
      .from('passwords')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching passwords:', error);
      return;
    }

    setPasswords(passwords || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const filteredPasswords = passwords.filter((password) => {
    const matchesCategory = !selectedCategory || password.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePasswordVisibility = (passwordId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [passwordId]: !prev[passwordId]
    }));
  };

  const handleAddPassword = () => {
    setShowNewPasswordModal(true);
    setNewPassword({
      title: '',
      username: '',
      password: generatePassword(),
      url: '',
      category: 'Personal',
    });
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const newPasswordEntry = {
      user_id: user.user.id,
      title: newPassword.title,
      username: newPassword.username,
      password: encrypt(newPassword.password, MASTER_KEY),
      url: newPassword.url,
      category: newPassword.category,
    };

    const { error } = await supabase
      .from('passwords')
      .insert([newPasswordEntry]);

    if (error) {
      console.error('Error adding password:', error);
      return;
    }

    setShowNewPasswordModal(false);
    fetchPasswords();
  };

  const handleGeneratePassword = () => {
    setNewPassword(prev => ({
      ...prev,
      password: generatePassword(16, {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      })
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-bold">SecureVault</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleAddPassword}
              className="bg-indigo-500 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-white hover:text-indigo-200 flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <ul className="space-y-2">
                <li 
                  onClick={() => handleCategoryClick(null)}
                  className={`flex items-center space-x-2 cursor-pointer ${!selectedCategory ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'}`}>
                  <Key className="w-4 h-4" />
                  <span>All Passwords</span>
                </li>
                {categories.map(category => (
                  <li 
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center space-x-2 cursor-pointer ${
                      selectedCategory === category.name ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'
                    }`}>
                    <span className={`w-2 h-2 rounded-full bg-${category.color}-500`}></span>
                    <span>{category.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Password List */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <input
                  type="search"
                  placeholder="Search passwords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="divide-y">
                {filteredPasswords.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <h3 className="font-medium">{item.title}</h3>
                          {item.url && (
                            <a 
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800">
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{item.username}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="relative flex-1">
                            <input
                              type={showPasswords[item.id] ? 'text' : 'password'}
                              value={decrypt(item.password, MASTER_KEY)}
                              readOnly
                              className="w-full bg-gray-50 px-3 py-1 rounded border text-sm"
                            />
                          </div>
                          <button
                            onClick={() => togglePasswordVisibility(item.id)}
                            className="p-1 hover:bg-gray-100 rounded">
                            {showPasswords[item.id] ? (
                              <EyeOff className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopyToClipboard(decrypt(item.password, MASTER_KEY))}
                            className="p-1 hover:bg-gray-100 rounded">
                            <Copy className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <span className={`ml-4 px-2 py-1 text-xs rounded-full ${
                        item.category === 'Personal' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'Work' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Password Modal */}
      {showNewPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Password</h2>
            <form onSubmit={handleSubmitNewPassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={newPassword.title}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username/Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    required
                    value={newPassword.username}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="password"
                      required
                      value={newPassword.password}
                      onChange={(e) => setNewPassword(prev => ({ ...prev, password: e.target.value }))}
                      className="block w-full rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="mt-1 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Generate Strong Password
                  </button>
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    Website URL (optional)
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={newPassword.url}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, url: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    value={newPassword.category}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPasswordModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo- 500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}