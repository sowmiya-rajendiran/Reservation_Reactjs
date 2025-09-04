import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { clearError, loginFailure, loginStart, loginSuccess } from "../store/slices/authSlice";
import { authAPI } from "../instances/endpoint";
import toast from "react-hot-toast";
import { useState } from "react";

function LoginPage(){
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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

    let handleLoginSubmit = async (e) =>{
        e.preventDefault();
        dispatch(loginStart());
        try {
            const response = await authAPI.login(formData);
            dispatch(loginSuccess(response.data));
            toast.success('Login successful!');

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            const role = response.data.user.role;
            if (role === "manager") {
                navigate("/managerdashboard");
            } else if (role === "admin"){
                navigate("/admindashboard");
            }else {
                navigate("/userdashboard");
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            dispatch(loginFailure(message));
            toast.error(message);
        }
    }
    return(
        <>
            <div className='h-screen bg-[url("/food-2.png")] bg-cover bg-no-repeat'>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10">
                    <div className="bg-white md:px-[60px] px-[30px] py-[45px] xl:w-2/6 lg:w-2/4 md:w-3/4 mx-[25px] md:mx-auto m-auto shadow-lg md:top-[100px] relative top-[70px] rounded-[10px]">
                        <h1 className="font-bold text-[18px] text-center mb-[20px]">Login</h1>
                
                        <form onSubmit={handleLoginSubmit}>
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
                            <label htmlFor="pwd" className="text-[15px] font-semibold text-left">Password</label>
                            <input 
                                type="password"
                                id="pwd"
                                className="text-[15px] font-semibold border border border-black px-[16px] py-[15px] rounded-[4px] focus:border-black focus:outline-none mt-[10px] h-[40px] w-full"
                                required
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength= {6}
                                
                            ></input><br></br>

                            {error && (
                            <div className="bg-red-100 text-red-600 text-sm text-center py-2 rounded relative mt-[10px]">
                                {error}
                                <button
                                onClick={() => dispatch(clearError())}
                                className="absolute right-2 top-2 text-red-800">✖</button>
                            </div>
                            )}

                            <button type="submit" disabled={loading}  className="text-center bg-black py-[10px] text-white text-[16px] font-semibold w-full mt-[25px] rounded-[4px] cursor-pointer">Login</button>
                        </form>

                        <p className="mt-[20px] text-[14px] font-semibold text-center"> Don't have an account? <Link to='/register' className="text-red-500">Click here</Link> </p>  
                        <p className="mt-[10px] text-[14px] font-semibold text-center">Forget password ? <Link to='/forgetpassword' className="text-red-500">Click here</Link> </p>
                        
                    </div>

                </div>
            </div>
        </>
    )
}

export default LoginPage;