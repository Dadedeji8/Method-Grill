import React from 'react'
import Navbar from '../../components/NavbarComponent.jsx'
import Swiper from 'swiper'
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import Hero from "./components/Hero.jsx"
import foodBG from '../../assets/img/fpkdl.com_750_uzbek-central-asia-cuisine-concept-assorted-uzbek-food-pilaf-samsa-lagman-manti-shurpa-uzbek-restaurant-concept_114941-585.webp'
import { Link } from 'react-router';
import Select from 'react-select';
import CardComponent from './components/CardComponent.jsx';
const MenuPage = () => {

    const categoriesArray = [
        { title: 'BREAKFAST MENU', imgURL: foodBG },
        { title: 'APPETIZERS', imgURL: foodBG },
        { title: 'BREAD LOVERS CORNER', imgURL: foodBG },
        { title: 'PROTEIN', imgURL: foodBG },
        { title: 'PEPPERSOUP CORNER', imgURL: foodBG },
        { title: 'LIGHT FOOD ', imgURL: foodBG },
        { title: 'SOUPS & SWALLOW', imgURL: foodBG },
    ]



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
                                categoriesArray.map((category, index) => (
                                    <CategoryCard key={index} title={category.title} imgURL={category.imgURL} />
                                ))
                            }

                        </div>
                    </div>
                </div>
                <div className=' mt-8 mb-4'>

                    <h3 className='font-bold text-primary text-3xl mb-5'>Food</h3>

                    <div>
                        <div className='flex flex-wrap gap-6'>
                            <div className="filters">
                                <div className="flex gap-1">
                                    <input type="text" placeholder="Search..." className="p-2 border border-gray-300 rounded-md" />
                                    <button className=" p-2 bg-primary hover:bg-primary/80 cursor-pointer text-white rounded-md">Search</button>
                                </div>
                            </div>
                            <Select styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused ? 'grey' : 'red',
                                    padding: "2px",
                                    minWidth: '100px'

                                })
                            }} options={categoriesArray.map(category => ({ value: category.title, label: category.title }))} />
                        </div>
                        <CardComponent />
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


export default MenuPage
