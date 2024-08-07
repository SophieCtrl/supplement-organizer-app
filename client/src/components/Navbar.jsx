import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Navbar = () => {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-300 shadow-md fixed top-0 left-0 w-full p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/" className="hover:text-blue-800">
            NutriTrack
          </Link>
        </div>
        <ul className="flex space-x-6">
          {!isLoggedIn && (
            <>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logOutUser}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
