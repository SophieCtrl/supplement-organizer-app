import { useState, useEffect, createContext } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
    setIsLoggedIn(true);
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
