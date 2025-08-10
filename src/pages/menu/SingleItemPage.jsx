import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Navbar from '../../components/NavbarComponent.jsx';
import { useMenu } from '../../contexts/MenuContext.jsx';

// Helper functions (same as MenuPage)
const formatNaira = (value) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
}).format(Number(value) || 0);

const stringToHsl = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h} 70% 40%)`;
};

const generateNameImage = (name = 'Food Item') => {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
    const bg = stringToHsl(name);
    const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stop-color='${bg}' stop-opacity='0.95'/>
          <stop offset='100%' stop-color='black' stop-opacity='0.35'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Inter, Poppins, Arial' font-size='180' fill='white' font-weight='700'>${initials}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getItemImage = (item) => {
    return (
        item?.featuredImage ||
        item?.image ||
        (Array.isArray(item?.images) && (item.images[0]?.url || item.images[0])) ||
        null
    );
};

const SingleItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { menuItems, loading, error } = useMenu();
    const [item, setItem] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (menuItems.length > 0 && id) {
            const foundItem = menuItems.find(item => item._id === id);
            setItem(foundItem);
        }
    }, [menuItems, id]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading menu item...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
                        <p className="text-gray-600 mb-6">The menu item you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const imgSrc = getItemImage(item) || generateNameImage(item?.name);
    const priceNGN = formatNaira(item?.price);
    const available = item?.isAvailable !== false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-secondary/5 rounded-full blur-2xl" />
                
                <div className="container mx-auto px-6 py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Section */}
                        <div className="relative group">
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                                <img
                                    src={imgSrc}
                                    alt={item.name}
                                    className={`w-full h-96 lg:h-[500px] object-cover transition-all duration-1000 ${
                                        imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                                    }`}
                                    onLoad={() => setImageLoaded(true)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                
                                {/* Floating Price Badge */}
                                <div className="absolute top-6 right-6">
                                    <div className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-2xl shadow-2xl border border-white/30 backdrop-blur-sm">
                                        {priceNGN}
                                    </div>
                                </div>
                                
                                {/* Status Badge */}
                                <div className="absolute bottom-6 left-6">
                                    <div className={`px-4 py-2 rounded-xl font-semibold text-sm shadow-lg backdrop-blur-sm border ${
                                        available 
                                            ? 'bg-emerald-500/90 text-white border-emerald-400/50' 
                                            : 'bg-red-500/90 text-white border-red-400/50'
                                    }`}>
                                        <span className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                available ? 'bg-emerald-200' : 'bg-red-200'
                                            } animate-pulse`} />
                                            {available ? 'Available Now' : 'Currently Unavailable'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="space-y-8">
                            {/* Back Button */}
                            <button
                                onClick={() => navigate('/menu')}
                                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
                            >
                                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="font-medium">Back to Menu</span>
                            </button>
                            
                            {/* Title & Category */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wider">
                                        {item.category || 'Special'}
                                    </span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
                                    {item.name}
                                </h1>
                                {item.description && (
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                            
                            {/* Price Display */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Price</p>
                                        <p className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            {priceNGN}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                        <p className={`text-lg font-bold ${available ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {available ? 'Available' : 'Unavailable'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {item.preparationTime && (
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <span className="text-orange-600 text-lg">⏱</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Prep Time</p>
                                                <p className="text-lg font-bold text-gray-900">{item.preparationTime} mins</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {item.spicyLevel && item.spicyLevel > 1 && (
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                <span className="text-red-600 text-lg">🌶️</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Spice Level</p>
                                                <p className="text-lg font-bold text-gray-900">{item.spicyLevel}/5</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Ingredients */}
                            {item.ingredients && item.ingredients.length > 0 && (
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ingredients</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.ingredients.map((ingredient, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                                            >
                                                {ingredient}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Allergens */}
                            {item.allergens && item.allergens.length > 0 && (
                                <div className="bg-red-50/80 backdrop-blur-sm rounded-xl p-6 border border-red-200/50">
                                    <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        Allergen Information
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.allergens.map((allergen, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium"
                                            >
                                                {allergen}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Action Button */}
                            <div className="pt-4">
                                <button
                                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                        available
                                            ? 'bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-2xl hover:shadow-primary/25 transform hover:scale-105'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                    disabled={!available}
                                >
                                    {available ? 'Order Coming Soon' : 'Currently Unavailable'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleItemPage;
