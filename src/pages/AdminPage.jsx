import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';
import { useNavigate } from 'react-router';
import Navbar from '../components/NavbarComponent.jsx';
import ImageUpload from '../components/ImageUpload.jsx';

const AdminPage = () => {
  const { user, isAuthenticated, logout, createAdmin } = useAuth();
  const {
    menuItems,
    categories,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    fetchMenuItems
  } = useMenu();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('menu');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showAdminForm, setShowAdminForm] = useState(false);

  const [menuForm, setMenuForm] = useState({
    name: '',
    price: '',
    description: '',
    featuredImage: '',
    images: [],
    isAvailable: true,
    ingredients: '',
    category: '',
    preparationTime: '',
    nutritionalInfo: "",
    allergens: "",
    spicyLevel: 1,
    imageMetadata: null
  });

  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });



  const handleMenuFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInputChange = (e, field) => {
    const value = e.target.value;
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setMenuForm(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleImageUpload = (imageUrl, uploadResult) => {
    setMenuForm(prev => ({
      ...prev,
      featuredImage: imageUrl,
      // Store additional image metadata if needed
      imageMetadata: uploadResult ? {
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes
      } : null
    }));
  };



  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...menuForm,
      price: parseFloat(menuForm.price),
      preparationTime: parseInt(menuForm.preparationTime) || 0,
      spicyLevel: parseInt(menuForm.spicyLevel) || 1
    };

    let result;
    if (editingItem) {
      result = await updateMenuItem(editingItem._id, formData);
    } else {
      result = await addMenuItem(formData);
    }

    if (result.success) {
      resetMenuForm();
      setShowAddForm(false);
      setEditingItem(null);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name || '',
      price: item.price || '',
      description: item.description || '',
      featuredImage: item.featuredImage || '',
      images: item.images || [],
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      ingredients: item.ingredients || "",
      category: item.category || '',
      preparationTime: item.preparationTime || '',
      nutritionalInfo: item.nutritionalInfo || '',
      allergens: item.allergens || "",
      spicyLevel: item.spicyLevel || 1
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem(id);
    }
  };

  const resetMenuForm = () => {
    setMenuForm({
      name: '',
      price: '',
      description: '',
      featuredImage: '',
      images: [],
      isAvailable: true,
      ingredients: "",
      category: '',
      preparationTime: '',
      nutritionalInfo: "",
      allergens: "",
      spicyLevel: 1,
      imageMetadata: null
    });
  };

  const handleAdminCreate = async (e) => {
    e.preventDefault();
    const result = await createAdmin(adminForm);
    if (result.success) {
      setAdminForm({ name: '', email: '', phoneNumber: '', password: '' });
      setShowAdminForm(false);
      alert('Admin created successfully!');
    }
  };

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded ${activeTab === 'menu' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Menu Management
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded ${activeTab === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Admin Management
          </button>
        </div>

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Menu Items</h2>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingItem(null);
                  resetMenuForm();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add New Item
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <form onSubmit={handleMenuSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={menuForm.name}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={menuForm.price}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                    required
                    step="0.01"
                  />
                  <select
                    name="category"
                    value={menuForm.category}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="soups & swallow">SOUPS & SWALLOW</option>
                    <option value="bread lovers corner">BREAD LOVERS CORNER</option>
                    <option value="peppersoup corner">PEPPERSOUP CORNER</option>
                    <option value="appetizers">APPETIZERS</option>
                    <option value="dessert">DESSERT</option>
                    <option value="beverage">BEVERAGE</option>
                    <option value="light food options">LIGHT FOOD OPTIONS</option>
                    <option value="breakfast menu">BREAKFAST MENU</option>
                    <option value="peppersoup corner">PEPPERSOUP CORNER</option>
                    <option value="special">SPECIAL</option>
                  </select>
                  <input
                    type="number"
                    name="preparationTime"
                    placeholder="Preparation Time (minutes)"
                    value={menuForm.preparationTime}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu Item Image
                    </label>
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      currentImage={menuForm.featuredImage}
                      placeholder="Upload menu item image"
                      className="w-full"
                    />
                  </div>
                  <input
                    type="number"
                    name="spicyLevel"
                    placeholder="Spicy Level (1-5)"
                    value={menuForm.spicyLevel}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                    min="1"
                    max="5"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={menuForm.description}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2 md:col-span-2"
                    rows="3"
                  />
                  <input
                    type="text"
                    placeholder="Ingredients (comma-separated)"
                    value={menuForm.ingredients}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Allergens (comma-separated)"
                    value={menuForm.allergens}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={menuForm.isAvailable}
                      onChange={handleMenuFormChange}
                      className="mr-2"
                    />
                    Available
                  </label>
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (editingItem ? 'Update' : 'Add')} Item
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingItem(null);
                        resetMenuForm();
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Menu Items List */}
            {loading && <div className="text-center">Loading menu items...</div>}
            {error && <div className="text-red-600 text-center">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    {item.featuredImage ? (
                      <img
                        src={item.featuredImage}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>

                    {/* Category Badge */}
                    {item.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {item.name}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-green-600">${item.price}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {item.description || 'No description available'}
                    </p>

                    {/* Additional Info */}
                    <div className="space-y-2 mb-4">
                      {item.preparationTime && (
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {item.preparationTime} mins
                        </div>
                      )}
                      
                      {item.spicyLevel && item.spicyLevel > 1 && (
                        <div className="flex items-center text-sm text-red-500">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Spicy Level: {item.spicyLevel}/5
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === 'admin' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Admin Management</h2>
              <button
                onClick={() => setShowAdminForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create New Admin
              </button>
            </div>

            {/* Create Admin Form */}
            {showAdminForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Create New Admin</h3>
                <form onSubmit={handleAdminCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Admin Name"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Admin Phone Number"
                    value={adminForm.phoneNumber}
                    onChange={(e) => setAdminForm({ ...adminForm, phoneNumber: e.target.value })}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Admin Password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="border rounded px-3 py-2 md:col-span-2"
                    required
                  />
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Create Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdminForm(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
