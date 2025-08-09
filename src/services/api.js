const API_BASE_URL = 'https://method-grill-backend.vercel.app/api/v1';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests with timeout
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // Create timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return makeRequest('/auth/profile');
  },

  createAdmin: async (adminData) => {
    return makeRequest('/auth/admin/create', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },
};

// Menu API
export const menuAPI = {
  getAllMenu: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('q', filters.search); // Backend uses 'q' for search
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.isAvailable !== undefined) queryParams.append('isAvailable', filters.isAvailable);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `/menu?${queryString}` : '/menu';
    
    return makeRequest(url);
  },

  getSingleMenuItem: async (id) => {
    return makeRequest(`/menu/${id}`);
  },

  getMenuCategories: async () => {
    return makeRequest('/menu/categories');
  },

  getPriceRange: async () => {
    return makeRequest('/menu/price-range');
  },

  addMenuItem: async (menuItem) => {
    return makeRequest('/menu', {
      method: 'POST',
      body: JSON.stringify(menuItem),
    });
  },

  updateMenuItem: async (id, menuItem) => {
    return makeRequest(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuItem),
    });
  },

  deleteMenuItem: async (id) => {
    return makeRequest(`/menu/${id}`, {
      method: 'DELETE',
    });
  },
};

// Helper functions for local storage
export const storage = {
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  clear: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};
