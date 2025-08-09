import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuAPI } from '../services/api';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    isAvailable: true,
  });

  // Fetch all menu items with filters
  const fetchMenuItems = async (customFilters = null) => {
    try {
      setLoading(true);
      setError(null);
      const activeFilters = customFilters || filters;
      const response = await menuAPI.getAllMenu(activeFilters);
      
      if (response.success) {
        // Backend returns data in response.data, which may be an array or paginated object
        const menuData = Array.isArray(response.data) ? response.data : response.data?.items || [];
        setMenuItems(menuData);
        
        // Handle pagination info if available
        if (response.pagination) {
          // You can store pagination info in state if needed for UI
          console.log('Pagination info:', response.pagination);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch menu items');
      }
    } catch (error) {
      console.error('Fetch menu items error:', error);
      setError(error.message);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await menuAPI.getMenuCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  // Fetch price range
  const fetchPriceRange = async () => {
    try {
      const response = await menuAPI.getPriceRange();
      if (response.success) {
        setPriceRange(response.data || { min: 0, max: 0 });
      }
    } catch (error) {
      console.error('Fetch price range error:', error);
    }
  };

  // Add new menu item
  const addMenuItem = async (menuItem) => {
    try {
      setLoading(true);
      const response = await menuAPI.addMenuItem(menuItem);
      
      if (response.success) {
        await fetchMenuItems(); // Refresh the list
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to add menu item');
    } catch (error) {
      console.error('Add menu item error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update menu item
  const updateMenuItem = async (id, menuItem) => {
    try {
      setLoading(true);
      const response = await menuAPI.updateMenuItem(id, menuItem);
      
      if (response.success) {
        await fetchMenuItems(); // Refresh the list
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Failed to update menu item');
    } catch (error) {
      console.error('Update menu item error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const deleteMenuItem = async (id) => {
    try {
      setLoading(true);
      const response = await menuAPI.deleteMenuItem(id);
      
      if (response.success) {
        await fetchMenuItems(); // Refresh the list
        return { success: true };
      }
      
      throw new Error(response.message || 'Failed to delete menu item');
    } catch (error) {
      console.error('Delete menu item error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update filters and fetch data
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchMenuItems(updatedFilters);
  };

  // Clear filters
  const clearFilters = () => {
    const defaultFilters = {
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      isAvailable: true,
    };
    setFilters(defaultFilters);
    fetchMenuItems(defaultFilters);
  };

  // Initial data fetch
  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    fetchPriceRange();
  }, []);

  const value = {
    menuItems,
    categories,
    priceRange,
    loading,
    error,
    filters,
    fetchMenuItems,
    fetchCategories,
    fetchPriceRange,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateFilters,
    clearFilters,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};
