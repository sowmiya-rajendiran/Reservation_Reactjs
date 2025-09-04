import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { authAPI } from "../instances/endpoint";
import { setUser } from "../store/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (!user) {
          // Try restoring user from backend
          const res = await authAPI.getProfile();
          if (res.data.success) {
            dispatch(setUser(res.data.user));
          } else {
            navigate("/login");
          }
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };

    verifySession();
  }, [user, dispatch, navigate]);

  if (checking) return <p>Checking session...</p>;

  return children;
};

export default ProtectedRoute;