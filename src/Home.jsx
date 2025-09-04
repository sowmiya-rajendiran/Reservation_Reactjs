
import { Link } from "react-router";

function Home(){

    return(
        <>
            <div className='h-screen bg-[url("/food-2.png")] bg-cover bg-no-repeat'>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10">
                    <div className="md:p-[40px] py-[35px] px-[25px]">
                        <div className="flex md:justify-end justify-center items-center">
                            <Link to='/register' className="text-white md:text-[17px] text-[15px] font-semibold md:mr-[25px] mr-[18px]">Register</Link>
                            <Link to='/login' className="text-white md:text-[17px] text-[15px] font-semibold md:mr-[25px]">Login</Link>
                        </div>
                        <div className="text-center">
                            <h1 className="text-[28px] md:text-6xl font-bold lg:mt-45 mt-[80px] md:mb-8 mb-[10px] text-white">
                                Welcome to FoodieHub 🍴
                            </h1>
                            <p className="md:text-[16px] text-[14px] text-white mb-[30px]">
                                Book your table in seconds and enjoy the best dining experience in
                                town.
                            </p>
                                <Link to='/restaurant' className="md:text-[17px] text-[15px] font-semibold bg-white px-[20px] py-[8px] rounded">Explore it</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;