import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";

const IsPrivate = ({ children }) => {
  const { isLoggedIn, authenticateUser, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authenticateUser();
    if (!isLoggedIn && !isLoading) {
      navigate("/login", { state: { from: location } });
    }
  }, [isLoggedIn, isLoading, navigate, authenticateUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? children : null;
};

export default IsPrivate;
