import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

const IsAnon = ({ children }) => {
  const token = localStorage.getItem("token");
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) return <p>Loading ...</p>;

  if (isLoggedIn) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
};

export default IsAnon;
