import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Navbar = () => {
  const { isLoggedIn, user } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <ul className="flex justify-between">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>

        {!isLoggedIn && (
          <>
            <li>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
          </>
        )}

        {isLoggedIn && (
          <>
            <li>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
