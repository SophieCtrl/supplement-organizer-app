import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";

const IsAnon = ({ children }) => {
  const { isLoggedIn, isLoading, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authenticateUser();
    if (isLoggedIn && !isLoading) {
      navigate("/profile", { state: { from: location } });
    }
  }, [isLoggedIn, isLoading, navigate, authenticateUser]);

  if (isLoading) return <p>Loading ...</p>;

  return !isLoggedIn ? children : null;
};

export default IsAnon;
