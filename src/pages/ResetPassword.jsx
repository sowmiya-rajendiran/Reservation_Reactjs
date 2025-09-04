import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { authAPI } from "../instances/endpoint";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password);
      if (res) {
        toast.success(res.message || "Password reset successfully");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Token expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white md:px-[60px] px-[30px] py-[45px] xl:w-2/6 lg:w-2/4 md:w-3/4 mx-[25px] md:mx-auto m-auto shadow-lg md:mt-[150px] mt-[80px] rounded-[10px] text-black">
      <h1 className="font-bold text-[18px] text-center mb-[15px]">
        Reset Password
      </h1>
      <form onSubmit={handleResetSubmit}>
        <label htmlFor="pwd" className="text-[15px] font-semibold text-left">
          Password
        </label>
        <input
          type="password"
          id="pwd"
          className="mb-[20px] text-[15px] font-semibold border border-black px-[16px] py-[15px] rounded-[4px] focus:border-black focus:outline-none mt-[10px] h-[40px] w-full"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          minLength={6}
        />
        <label
          htmlFor="confirmpwd"
          className="text-[15px] font-semibold text-left"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmpwd"
          className="text-[15px] font-semibold border border-black px-[16px] py-[15px] rounded-[4px] focus:border-black focus:outline-none mt-[10px] h-[40px] w-full"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          minLength={6}
        />
        <button
          type="submit"
          disabled={loading}
          className="text-center bg-black py-[10px] text-white text-[16px] font-semibold w-full mt-[25px] rounded-[4px] cursor-pointer disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;