import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';
import { useNavigate } from 'react-router';
import Navbar from '../components/NavbarComponent.jsx';

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
    ingredients: [],
    category: '',
    preparationTime: '',
    nutritionalInfo: {},
    allergens: [],
    spicyLevel: 1
  });

  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.role !== 'admin') {
      navigate('/menu');
    }
  }, [isAuthenticated, user, navigate]);

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
      ingredients: item.ingredients || [],
      category: item.category || '',
      preparationTime: item.preparationTime || '',
      nutritionalInfo: item.nutritionalInfo || {},
      allergens: item.allergens || [],
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
      ingredients: [],
      category: '',
      preparationTime: '',
      nutritionalInfo: {},
      allergens: [],
      spicyLevel: 1
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
                    <option value="appetizer">Appetizer</option>
                    <option value="main-course">Main Course</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                    <option value="side-dish">Side Dish</option>
                    <option value="special">Special</option>
                  </select>
                  <input
                    type="number"
                    name="preparationTime"
                    placeholder="Preparation Time (minutes)"
                    value={menuForm.preparationTime}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="url"
                    name="featuredImage"
                    placeholder="Featured Image URL"
                    value={menuForm.featuredImage}
                    onChange={handleMenuFormChange}
                    className="border rounded px-3 py-2"
                  />
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
                    value={menuForm.ingredients.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'ingredients')}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Allergens (comma-separated)"
                    value={menuForm.allergens.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'allergens')}
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
                <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
                  {item.featuredImage && (
                    <img
                      src={item.featuredImage}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <p className="text-lg font-bold text-green-600 mb-2">${item.price}</p>
                  <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Status: {item.isAvailable ? 'Available' : 'Unavailable'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
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
                    onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Admin Phone Number"
                    value={adminForm.phoneNumber}
                    onChange={(e) => setAdminForm({...adminForm, phoneNumber: e.target.value})}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Admin Password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
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
