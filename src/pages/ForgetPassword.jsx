import { useState } from "react";
import { authAPI } from "../instances/endpoint";
import toast from "react-hot-toast";

function ForgetPassword(){

    const [email , setEmail] = useState('');
    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const res = await authAPI.forgotPasswordData(email);

        if (res) {
          toast.success(res.message || "Email Send Successfully");
        } else {
          toast.error(res.message || "Something went wrong. Try again.");
        }

        setEmail("");
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Something went wrong, your email may not be registered."
        );
      }
    };

    return(
        <>
            <div className='h-screen bg-[url("/food-2.png")] bg-cover bg-no-repeat'>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10">
                    <div className="bg-white md:px-[60px] px-[30px] py-[45px] xl:w-2/6 lg:w-2/4 md:w-3/4 mx-[25px] md:mx-auto m-auto shadow-lg  md:top-[100px] relative top-[70px] rounded-[10px] text-center">
                        <h1 className="font-bold text-[18px]">Forgot your password ?</h1>
                        <p className="mt-[10px] mb-[30px] text-[14px] font-semibold">Enter your email to reset it</p>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="email" 
                                className="text-[15px] font-semibold border border border-black px-[16px] py-[15px] rounded-[4px] focus:border-black focus:outline-none mt-[10px] h-[40px] w-full"
                                placeholder="Enter Email here"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                
                            ></input><br></br>
                            <button type="submit"  className="text-center bg-black py-[10px] text-white text-[16px] font-semibold w-full mt-[25px] rounded-[4px] cursor-pointer">Confirm</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgetPassword;