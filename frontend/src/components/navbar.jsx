import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import userLogo from "../assets/user-logo.png";
import websiteLogo from "../assets/website-logo.png";

const Navbar = ({ message, setMessage }) => {
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
      setMessage({
        type: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        message: `Logout failed`,
      });
    }
  };

  return (
    <nav className="bg-gray-800 p-2 flex items-center justify-between">
      <div className="flex items-center">
        <img src={websiteLogo} alt="Logo" className="w-60 h-12 mr-2" />
        <Link to="/" className="mx-4 text-lg text-white underline-offset-4">
          Home
        </Link>
        <Link to="/meeting" className="mx-4 text-lg text-white underline-offset-4">
          Record Meeting
        </Link>
        <Link to="/history" className="mx-4 text-lg text-white underline-offset-4">
          Meeting History
        </Link>
      </div>
      <div className="flex items-center mx-4">
        {user ? (
          <div className="flex items-center">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
              <span className="text-white mr-2">{user}</span>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-24 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <Link to="/login" className="text-lg text-white underline-offset-4">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
