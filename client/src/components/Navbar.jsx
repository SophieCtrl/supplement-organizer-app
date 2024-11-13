import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-white border-b border-gray-300 shadow-md fixed top-0 left-0 w-full py-4 px-8 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          {!isLoggedIn && (
            <Link to="/" className="hover:text-blue-800">
              NutriTrack
            </Link>
          )}
          {isLoggedIn && (
            <>
              <div
                className="flex items-center cursor-pointer hover:text-blue-800"
                onClick={toggleDropdown}
              >
                <span>My NutriTrack</span>
                <ChevronDownIcon className="w-5 h-5 font-bold ml-2" />
              </div>
              {showDropdown && (
                <ul className="absolute left-0 mt-4 pb-4 pl-6 pr-14 bg-white border border-gray-300 border-t-0 border-l-0 shadow-lg rounded-b">
                  <li className="py-2 px-4">
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-blue-800 text-sm font-medium"
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="py-2 px-4">
                    <Link
                      to="/my-supplements"
                      className="text-gray-700 hover:text-blue-800 text-sm font-medium"
                    >
                      My Supplements
                    </Link>
                  </li>
                  <li className="py-2 px-4">
                    <button
                      onClick={logOutUser}
                      className="w-full text-left text-gray-700 hover:text-blue-800 text-sm font-medium"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          )}
        </div>
        <ul className="flex space-x-6">
          {!isLoggedIn && (
            <>
              <li>
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              to="/supplements"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              All Supplements
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
