import img from '../../../assets/img/fpkdl.com_750_uzbek-central-asia-cuisine-concept-assorted-uzbek-food-pilaf-samsa-lagman-manti-shurpa-uzbek-restaurant-concept_114941-585.webp'
import { SlArrowRight } from "react-icons/sl";
const CardComponent = () => {
    return (
        <div className=" p-2 rounded-3xl shadow-lg w-[260px]">
            <div className='w-[250px]  h-[200px] overflow-hidden rounded-2xl'>

                <img src={img} alt="" className="w-full h-full" />
            </div>
            <div className="text-wrapper max-w-[250px] mt-2">
                <h2 className=' text-md font-semibold *:text-primary leading-10' >
                    Delicious Uzbek Cuisine
                </h2>
                <p className='text-sm text-gray-600 tracking-widest'>
                    Experience the rich flavors and unique dishes of Uzbekistan, from savory pilaf to delicious dumplings.
                </p>

            </div>
            <div className='mt-5  flex justify-between items-center'>
                <button className='bg-[#ffffff] text-black border-1 px-2 py-1 font-semibold rounded-3xl'>
                    ₦2,0000
                </button>
                <button className='bg-primary text-white px-1 py-1 font-semibold rounded-3xl h-[30px] flex items-center gap-2 cursor-pointer'>
                    View more  <span className="flex items-center justify-center bg-white text-primary rounded-full text-sm p-1">
                        <SlArrowRight />
                    </span>
                </button>
            </div>
        </div>
    )
}

export default CardComponent
