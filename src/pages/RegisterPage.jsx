import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { authAPI } from "../instances/endpoint";
import { registerFailure, registerStart, registerSuccess } from "../store/slices/authSlice";
import toast from "react-hot-toast";

function RegisterPage(){

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone:'',
        role: 'user',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    let handleReSubmit = async (e) => {
        e.preventDefault();

        dispatch(registerStart());

        try {
            const {...dataToSend } = formData;
            const response = await authAPI.register(dataToSend);
            dispatch(registerSuccess(response.data));
            toast.success('Registration successful!');
            const role = response.data.user.role;
            if (role === "manager") {
                navigate("/managerdashboard");
            } else if (role === "admin"){
                navigate("/admindashboard");
            }
            else {
                navigate("/userdashboard");
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            dispatch(registerFailure(message));
            toast.error(message);
        }
    }
    return(
        <>
            <div className='h-screen bg-[url("/food-2.png")] bg-cover bg-no-repeat'>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10">
                    <div className="bg-white md:px-[60px] px-[30px] py-[45px] xl:w-2/6 lg:w-2/4 md:w-3/4 mx-[25px] md:mx-auto m-auto shadow-lg md:top-[20px] rounded-[10px] top-[50px]  relative">
                        <h1 className="font-bold text-[18px] text-center mb-[20px]">Sign Up</h1>
                        
                        <form onSubmit={handleReSubmit}>
                            <label htmlFor="name" className="text-[15px] font-semibold text-left">Username</label>
                            <input 
                                type="text"
                                id="name"
                                className="mb-[10px] text-[15px] font-semibold border border border-black px-[16px] py-[15px] rounded-[4px] focus:border-black focus:outline-none mt-[10px] h-[40px] w-full"
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                
                            ></input><br></br>
                            <label htmlFor="email" className="text-[15px] font-semibold text-left">Email</label>
                            <input 
                                type="email"
                                id="email"
                                className="mb-[10px] text-[15px] font-semibold border border border-black px-[16px] py-[15px] rounded-[4px] focus:border-black focus:outline-none mt-[10px] h-[40px] w-full"
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                 
                            ></input><br></br>

                             <label htmlFor="phn" className="text-[15px] font-semibold text-left">Phone</label>
                            <input 
                                type="tel"
                                id="phn"
                                className=" mb-[10px] text-[15px] font-semibold border border border-black px-[16px] py-[15px] rounded-[4px] focus:border-black focus:outline-none mt-[10px] h-[40px] w-full"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                name="phone"
                                pattern="[0-9]{10}" 
                                maxLength="10" 
                            ></input><br></br>

                            <label htmlFor="pwd" className="text-[15px] font-semibold text-left">Password</label>
                            <input 
                                type="password"
                                id="pwd"
                                className="text-[15px] font-semibold border border border-black px-[16px] py-[15px] rounded-[4px] focus:border-black focus:outline-none mt-[10px] mb-[10px] h-[40px] w-full"
                                required
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength= {6}
                                
                            ></input><br></br>
                            
                            <label htmlFor="role" className="text-[15px] font-semibold text-left">Role</label>
                            <select
                                name="role"
                                id="role"
                                className="relative block w-full px-3 py-2 border border-black  rounded-[4px] focus:outline-none focus:border-black text-[15px] mt-[10px] mb-[10px]"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="user">user</option>
                                <option value="manager">manager</option>
                                <option value="admin">admin</option>
                            </select>
                            <button type="submit"  className="text-center bg-black py-[10px] text-white text-[16px] font-semibold w-full mt-[25px] rounded-[4px] cursor-pointer">Sign Up</button>
                        </form>
                        <p className="mt-[10px] mt-[20px] text-[14px] font-semibold text-center">Already have an account ? <Link to='/login' className="text-red-500">Sign In</Link> </p>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterPage;