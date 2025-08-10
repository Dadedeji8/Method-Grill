import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Navbar from '../../components/NavbarComponent.jsx';
import { useMenu } from '../../contexts/MenuContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

// Helper functions for price formatting and image fallbacks
const formatNaira = (value) => {
    if (!value) return '₦0';
    return `₦${Number(value).toLocaleString()}`;
};

const stringToHsl = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
};

const generateNameImage = (name = 'Food Item') => {
    const initials = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    
    const backgroundColor = stringToHsl(name);
    
    return (
        <div 
            className="w-full h-full flex items-center justify-center text-white font-bold text-2xl rounded-t-[1.5rem]"
            style={{ backgroundColor }}
        >
            {initials}
        </div>
    );
};

const getItemImage = (item) => {
    if (item?.imageUrl && item.imageUrl !== '') {
        return <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-t-[1.5rem]" />;
    }
    return generateNameImage(item?.name);
};

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const {
        menuItems,
        loading,
        error,
        filters,
        updateFilters,
        fetchMenuItems
    } = useMenu();
    const { user } = useAuth();

    const [searchTerm, setSearchTerm] = useState('');

    // Decode the category from URL
    const decodedCategory = decodeURIComponent(category);

    useEffect(() => {
        // Set category filter when component mounts
        updateFilters({ category: decodedCategory, search: '' });
    }, [decodedCategory]);

    const handleSearch = () => {
        updateFilters({ category: decodedCategory, search: searchTerm });
    };

    const handleRefresh = async () => {
        await fetchMenuItems();
    };

    const handleBackToMenu = () => {
        navigate('/menu');
    };

    // Filter items by category
    const categoryItems = menuItems.filter(item => 
        item.category?.toLowerCase() === decodedCategory.toLowerCase()
    );

    const MenuItemCard = ({ item }) => {
        const navigate = useNavigate();
        const available = item?.isAvailable !== false;
        const priceNGN = formatNaira(item?.price);

        const handleViewItem = () => {
            if (available) {
                navigate(`/menu/item/${item._id}`);
            }
        };

        return (
            <div className="group relative bg-white rounded-[1.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden border border-gray-100/50">
                {/* Image Container with Overlay Effects */}
                <div className="relative h-48 overflow-hidden">
                    {getItemImage(item)}
                    
                    {/* Availability Overlay */}
                    {!available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-[1.5rem]">
                            <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-full">
                                Out of Stock
                            </span>
                        </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-t-[1.5rem]" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    {/* Title and Description */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                            {item?.name || 'Unnamed Item'}
                        </h3>
                        {item?.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                {item.description}
                            </p>
                        )}
                    </div>

                    {/* Tags/Badges */}
                    {(item?.preparationTime || (item?.spicyLevel && item.spicyLevel > 1)) && (
                        <div className="flex flex-wrap gap-2">
                            {item?.preparationTime && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-600 rounded-lg text-[10px] font-bold border border-orange-200/50 hover:shadow-md transition-all duration-300">
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                                    <span>{item.preparationTime}m</span>
                                </div>
                            )}
                            {item?.spicyLevel && item.spicyLevel > 1 && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-200/50 hover:shadow-md transition-all duration-300">
                                    <span className="animate-bounce text-xs">🌶️</span>
                                    <span>Lv{item.spicyLevel}</span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Action Area */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Price</span>
                            <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {priceNGN}
                            </span>
                        </div>
                        
                        <button
                            onClick={handleViewItem}
                            className={`group/btn relative px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-500 transform ${
                                available
                                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-primary hover:to-primary/90 hover:shadow-xl hover:shadow-primary/25 hover:scale-105 hover:-rotate-1'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            } overflow-hidden`}
                            disabled={!available}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                            <span className="relative z-10 flex items-center gap-1.5">
                                {available ? (
                                    <>
                                        <span>View</span>
                                        <svg className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                ) : (
                                    'Unavailable'
                                )}
                            </span>
                        </button>
                    </div>
                </div>
                
                {/* Ambient Light Effect */}
                <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </div>
        );
    };

    return (
        <div>
            <Navbar />
            <section className='container'>
                {/* Header */}
                <div className="mt-8 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={handleBackToMenu}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Menu
                        </button>
                    </div>
                    
                    <h1 className='font-bold text-primary text-4xl mb-2'>{decodedCategory}</h1>
                    <p className="text-gray-600">
                        {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'} available
                    </p>
                </div>

                {/* Error Handling */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-700 font-medium">Failed to load category items</span>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md transition-colors duration-200"
                            >
                                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {loading ? 'Refreshing...' : 'Retry'}
                            </button>
                        </div>
                        <p className="text-red-600 text-sm mt-2">{error}</p>
                    </div>
                )}

                {/* Search */}
                <div className="mb-6">
                    <div className="flex gap-2 max-w-md">
                        <input
                            type="text"
                            placeholder={`Search in ${decodedCategory}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Items Grid */}
                {!loading && (
                    <div>
                        {categoryItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categoryItems.map((item, index) => (
                                    <MenuItemCard key={item._id || index} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                                    <p className="text-gray-500">
                                        {searchTerm 
                                            ? `No items match your search "${searchTerm}" in ${decodedCategory}`
                                            : `No items available in ${decodedCategory} category`
                                        }
                                    </p>
                                    {searchTerm && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                updateFilters({ category: decodedCategory, search: '' });
                                            }}
                                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors duration-200"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default CategoryPage;
