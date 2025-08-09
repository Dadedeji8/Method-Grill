import React, { useState, useEffect } from 'react'
import Navbar from '../../components/NavbarComponent.jsx'
import Swiper from 'swiper'
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import Hero from "./components/Hero.jsx"
import foodBG from '../../assets/img/fpkdl.com_750_uzbek-central-asia-cuisine-concept-assorted-uzbek-food-pilaf-samsa-lagman-manti-shurpa-uzbek-restaurant-concept_114941-585.webp'
import { Link } from 'react-router';
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
        clearFilters 
    } = useMenu();
    const { user } = useAuth();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

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
        updateFilters({ search: searchTerm });
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    return <div className={`rounded-md bg-orange-300 bg-[url('${imgURL}')] bg-cover bg-center h-48 p-3 sm:p-1 flex justify-center items-center `} style={{ background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${imgURL})` }}>
        <h1 className='md:text-xl font-bold text-white'>
            <Link to={`/menu/${title.toLowerCase().replace(/\s+/g, '-')}`} className='hover:underline'>
                {title}
            </Link>
        </h1>
    </div>
}

const MenuItemCard = ({ item }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {item.featuredImage && (
                <img
                    src={item.featuredImage}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-green-600">${item.price}</span>
                </div>
                
                {item.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {item.category}
                    </span>
                    {item.preparationTime && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {item.preparationTime} min
                        </span>
                    )}
                    {item.spicyLevel && item.spicyLevel > 1 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            🌶️ {item.spicyLevel}/5
                        </span>
                    )}
                </div>
                
                {item.ingredients && item.ingredients.length > 0 && (
                    <div className="mb-3">
                        <p className="text-sm text-gray-500">
                            <strong>Ingredients:</strong> {item.ingredients.slice(0, 3).join(', ')}
                            {item.ingredients.length > 3 && '...'}
                        </p>
                    </div>
                )}
                
                {item.allergens && item.allergens.length > 0 && (
                    <div className="mb-3">
                        <p className="text-sm text-red-600">
                            <strong>Allergens:</strong> {item.allergens.join(', ')}
                        </p>
                    </div>
                )}
                
                <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        item.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    
                    {item.isAvailable && (
                        <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md transition-colors">
                            Order Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}


export default MenuPage
