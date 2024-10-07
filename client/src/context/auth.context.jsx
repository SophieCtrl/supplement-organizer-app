import { useState, useEffect, createContext } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const storeToken = (token, redirectPath = "/") => {
    localStorage.setItem("authToken", token);
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
    setIsLoggedIn(true);
    setRedirectPath(redirectPath);
  };

  const authenticateUser = () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${storedToken}`;
      axiosInstance
        .get(`/auth/verify`)
        .then((response) => {
          const user = response.data;
          setIsLoggedIn(true);
          setUser(user);
          if (redirectPath) {
            navigate(redirectPath, { state: { from: location } });
            setRedirectPath(null);
          }
        })
        .catch((error) => {
          setAuthError(error.response?.data?.message || "Authentication error");
          setIsLoggedIn(false);
          setUser(null);
          removeToken();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
    axiosInstance.defaults.headers.Authorization = null;
  };

  const logOutUser = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/", { state: { from: location } });
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        authError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
