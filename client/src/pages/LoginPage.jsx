import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { authToken } = response.data;
      localStorage.setItem("authToken", authToken);
      storeToken(authToken);
      authenticateUser();
      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 my-8">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-4 my-1 rounded-lg w-full font-semibold shadow-md hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
