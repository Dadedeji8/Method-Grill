import React, { useState, useEffect } from 'react'
import Navbar from '../../components/NavbarComponent.jsx'
import Swiper from 'swiper'
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import Hero from "./components/Hero.jsx"
import foodBG from '../../assets/img/fpkdl.com_750_uzbek-central-asia-cuisine-concept-assorted-uzbek-food-pilaf-samsa-lagman-manti-shurpa-uzbek-restaurant-concept_114941-585.webp'
import { Link, useNavigate } from 'react-router';
import Select from 'react-select';
import CardComponent from './components/CardComponent.jsx';
import { useMenu } from '../../contexts/MenuContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const MenuPage = () => {
    const {
        menuItems,
        categories,
        loading,
        error,
        filters,
        updateFilters,
        clearFilters,
        fetchMenuItems,
        fetchCategories
    } = useMenu();
    const { user } = useAuth();

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category ? { value: filters.category, label: filters.category } : null
    );

    // Update local state when filters change from external sources (like navbar search)
    useEffect(() => {
        setSearchTerm(filters.search || '');
        setSelectedCategory(
            filters.category ? { value: filters.category, label: filters.category } : null
        );
    }, [filters.search, filters.category]);

    // Fallback categories for display
    const fallbackCategories = [
        { title: 'BREAKFAST MENU', imgURL: foodBG },
        { title: 'APPETIZERS', imgURL: foodBG },
        { title: 'BREAD LOVERS CORNER', imgURL: foodBG },
        { title: 'PROTEIN', imgURL: foodBG },
        { title: 'PEPPERSOUP CORNER', imgURL: foodBG },
        { title: 'LIGHT FOOD ', imgURL: foodBG },
        { title: 'SOUPS & SWALLOW', imgURL: foodBG },
    ];

    // Use API categories if available, otherwise use fallback
    const displayCategories = categories.length > 0
        ? categories.map(cat => ({ title: cat.toUpperCase(), imgURL: foodBG }))
        : fallbackCategories;

    const handleSearch = () => {
        const trimmedSearch = searchTerm.trim();
        updateFilters({ search: trimmedSearch });
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        updateFilters({ category: selectedOption ? selectedOption.value : '' });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory(null);
        clearFilters();
    };

    const handleRefresh = async () => {
        await fetchMenuItems();
        await fetchCategories();
    };

    return (
        <div>
            <Navbar />
            <section className='container'>
                <div>
                    <Hero />
                </div>
                <div className=' mt-8 mb-4'>

                    <h3 className='font-bold text-primary text-3xl mb-5'>Menu</h3>

                    <div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4'>
                            {
                                displayCategories.map((category, index) => (
                                    <CategoryCard key={index} title={category.title} imgURL={category.imgURL} />
                                ))
                            }

                        </div>
                    </div>
                </div>
                <div className=' mt-8 mb-4'>

                    <h3 className='font-bold text-primary text-3xl mb-5'>Food</h3>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-red-700 font-medium">Failed to load menu items</span>
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

                    <div>
                        <div className='flex flex-wrap gap-6 mb-4'>
                            <div className="filters">
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className=" p-2 bg-primary hover:bg-primary/80 cursor-pointer text-white rounded-md"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategorySelect}
                                isClearable
                                placeholder="Select category..."
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderColor: state.isFocused ? 'grey' : 'red',
                                        padding: "2px",
                                        minWidth: '200px'
                                    })
                                }}
                                options={displayCategories.map(category => ({
                                    value: category.title.toLowerCase().replace(/\s+/g, '-'),
                                    label: category.title
                                }))}
                            />
                            <button
                                onClick={handleClearFilters}
                                className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                            >
                                Clear Filters
                            </button>
                        </div>

                        {loading && (
                            <div className="text-center py-8">
                                <div className="text-lg">Loading menu items...</div>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-8">
                                <div className="text-red-600 text-lg">{error}</div>
                            </div>
                        )}

                        <div className='mt-2'>
                            {menuItems.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {menuItems.map((item) => (
                                        <MenuItemCard key={item._id} item={item} />
                                    ))}
                                </div>
                            ) : !loading && (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg">No menu items found</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}

const CategoryCard = ({ title, imgURL }) => {
    return (
        <div className="group relative overflow-hidden rounded-3xl h-48 transform transition-all duration-700 hover:-translate-y-2 hover:scale-105 hover:rotate-1 perspective-1000">
            {/* Background Image with Advanced Effects */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${imgURL})` }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 group-hover:from-black/50 group-hover:to-black/60 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-secondary/20 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-secondary/25 to-secondary/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700" />
            
            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-center items-center p-6 text-center">
                {/* Decorative Border */}
                <div className="absolute inset-4 border-2 border-white/20 rounded-2xl group-hover:border-white/40 group-hover:scale-105 transition-all duration-500" />
                
                {/* Title with Advanced Typography */}
                <h1 className="relative z-10 text-white font-black text-lg md:text-xl lg:text-2xl leading-tight tracking-wide group-hover:scale-110 transition-all duration-300">
                    <Link 
                        to={`/menu/category/${encodeURIComponent(title)}`} 
                        className="relative inline-block group-hover:text-primary-light transition-colors duration-300"
                    >
                        <span className="relative">
                            {title}
                            {/* Animated Underline */}
                            <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full group-hover:w-full transition-all duration-500" />
                        </span>
                        
                        {/* Shine Effect on Text */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                </h1>
                
                {/* Subtitle/Description */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <p className="text-white/90 text-sm font-medium tracking-wider">
                        Explore Menu
                    </p>
                </div>
                
                {/* Interactive Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500 delay-200">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <svg className="w-4 h-4 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>
            
            {/* Glass Morphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 backdrop-blur-sm" />
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 rounded-3xl shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-700" />
            
            {/* Border Highlight */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/30 transition-colors duration-500" />
        </div>
    );
}

// Helpers for price formatting and image fallbacks
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
    <svg xmlns='http://www.w3.org/2000/svg' width='640' height='420'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stop-color='${bg}' stop-opacity='0.95'/>
          <stop offset='100%' stop-color='black' stop-opacity='0.35'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Inter, Poppins, Arial' font-size='140' fill='white' font-weight='700'>${initials}</text>
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

const MenuItemCard = ({ item }) => {
    const navigate = useNavigate();
    const imgSrc = getItemImage(item) || generateNameImage(item?.name);
    const priceNGN = formatNaira(item?.price);
    const available = item?.isAvailable !== false;
    
    const handleViewItem = () => {
        if (available && item?._id) {
            navigate(`/menu/item/${item._id}`);
        }
    };

    return (
        <div className="group relative w-full perspective-1000">
            <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-[1.5rem] shadow-[0_6px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_45px_rgba(221,52,56,0.12)] transition-all duration-700 ease-out transform hover:-translate-y-1 hover:rotate-1 overflow-hidden border border-white/60 backdrop-blur-xl">
                
                {/* Floating Elements */}
                <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000" />
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-tr from-secondary/20 to-secondary/5 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700" />
                
                {/* Image Container with Advanced Effects */}
                <div className="relative h-44 overflow-hidden rounded-t-[1.5rem]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 z-10" />
                    <img
                        src={imgSrc}
                        alt={item?.name}
                        className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-115 group-hover:rotate-1"
                        loading="lazy"
                    />
                    
                    {/* Animated Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                    
                    {/* Morphing Price Display */}
                    <div className="absolute top-3 right-3 transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md" />
                            <div className="relative bg-gradient-to-r from-primary to-primary/90 text-white px-3 py-2 rounded-xl font-bold text-sm tracking-tight shadow-xl border border-white/30">
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10">{priceNGN}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating Category */}
                    <div className="absolute top-3 left-3 transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
                        <div className="bg-white/95 backdrop-blur-md text-gray-800 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] shadow-lg border border-white/50">
                            {item?.category || 'Special'}
                        </div>
                    </div>
                    
                    {/* Status Indicator with Pulse */}
                    <div className="absolute bottom-3 left-3">
                        <div className={`relative px-3 py-1.5 rounded-lg font-semibold text-xs shadow-lg backdrop-blur-sm border transition-all duration-300 ${
                            available 
                                ? 'bg-emerald-500/90 text-white border-emerald-400/50 shadow-emerald-500/30' 
                                : 'bg-red-500/90 text-white border-red-400/50 shadow-red-500/30'
                        }`}>
                            <div className={`absolute inset-0 rounded-lg animate-pulse ${
                                available ? 'bg-emerald-400/30' : 'bg-red-400/30'
                            }`} />
                            <span className="relative z-10 flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    available ? 'bg-emerald-200' : 'bg-red-200'
                                } animate-pulse`} />
                                {available ? 'Available' : 'Sold Out'}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Content Area with Glass Morphism */}
                <div className="relative p-5 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-sm">
                    {/* Title with Animated Underline */}
                    <div className="mb-3">
                        <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                            <span className="relative inline-block">
                                {item?.name}
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500" />
                            </span>
                        </h3>
                        {item?.description && (
                            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                                {item.description}
                            </p>
                        )}
                    </div>
                    
                    {/* Animated Info Tags */}
                    {(item?.preparationTime || (item?.spicyLevel && item.spicyLevel > 1)) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {item?.preparationTime && (
                                <div className="group/tag flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-lg text-[10px] font-bold border border-orange-200/50 hover:shadow-md transition-all duration-300">
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
                    
                    {/* Action Area with Magnetic Effect */}
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
        </div>
    );
}
export default MenuPage
