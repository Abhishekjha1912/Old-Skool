import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user, logout } = useContext(AuthContext);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isHomePage 
          ? isScrolled ? "bg-white shadow-md" : "bg-transparent"
          : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div
          className={`font-bold text-2xl tracking-wide ${
            isHomePage && !isScrolled ? "text-white" : "text-gray-900"
          }`}
        >
          OLD <span className="text-orange-500">SKOOL</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isHomePage && !isScrolled
                ? "text-white hover:text-red-400"
                : "text-gray-800 hover:text-red-500"
            }`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`text-sm font-medium transition-colors ${
              isHomePage && !isScrolled
                ? "text-white hover:text-red-400"
                : "text-gray-800 hover:text-red-500"
            }`}
          >
            Menu
          </Link>
          <Link
            to="/book-table"
            className={`text-sm font-medium transition-colors ${
              isHomePage && !isScrolled
                ? "text-white hover:text-red-400"
                : "text-gray-800 hover:text-red-500"
            }`}
          >
            Book Table
          </Link>
          <Link
            to="/story"
            className={`text-sm font-medium transition-colors ${
              isHomePage && !isScrolled
                ? "text-white hover:text-red-400"
                : "text-gray-800 hover:text-red-500"
            }`}
          >
            Our Story
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors ${
              isHomePage && !isScrolled
                ? "text-white hover:text-red-400"
                : "text-gray-800 hover:text-red-500"
            }`}
          >
            Contact
          </Link>
          
          {user && (String(user.role || '').toLowerCase() === 'admin') && (
            <>
              <Link
                to="/admin/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isHomePage && !isScrolled
                    ? "text-white hover:text-red-400"
                    : "text-gray-800 hover:text-red-500"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/manage-menu"
                className={`text-sm font-medium transition-colors ${
                  isHomePage && !isScrolled
                    ? "text-white hover:text-red-400"
                    : "text-gray-800 hover:text-red-500"
                }`}
              >
                Manage Menu
              </Link>
            </>
          )}
          
          {user ? (
            <button
              onClick={logout}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isHomePage && !isScrolled
                  ? "bg-white text-orange-500 hover:bg-orange-50"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isHomePage && !isScrolled
                  ? "bg-white text-orange-500 hover:bg-orange-50"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <FiX
              className={`text-2xl ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-800"
              }`}
            />
          ) : (
            <FiMenu
              className={`text-2xl ${
                isHomePage && !isScrolled ? "text-white" : "text-gray-800"
              }`}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setIsOpen(false)}
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Logo in sidebar */}
        <div className="p-6 border-b border-gray-200">
          <div className="font-bold text-xl tracking-wide text-gray-900">
            OLD <span className="text-orange-500">SKOOL</span>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="px-4 py-6">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-lg text-gray-800 hover:text-orange-500 flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-lg text-gray-800 hover:text-orange-500 flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/book-table"
              className="text-lg text-gray-800 hover:text-orange-500 flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Book Table
            </Link>
            <Link
              to="/story"
              className="text-lg text-gray-800 hover:text-orange-500 flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              className="text-lg text-gray-800 hover:text-orange-500 flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {user && (String(user.role || '').toLowerCase() === 'admin') && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-lg text-gray-800 hover:text-orange-500 flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/manage-menu"
                  className="text-lg text-gray-800 hover:text-orange-500 flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Manage Menu
                </Link>
              </>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-lg text-white bg-orange-500 hover:bg-orange-600 flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors duration-200 mt-4 w-full"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-lg text-white bg-orange-500 hover:bg-orange-600 flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors duration-200 mt-4"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">© 2025 Old Skool</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
