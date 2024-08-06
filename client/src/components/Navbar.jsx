// src/components/Navbar.jsx

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <ul className="flex justify-between">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
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
      </ul>
    </nav>
  );
};

export default Navbar;
