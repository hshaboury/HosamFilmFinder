import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { favoritesCount } = useFavorites();

  return (
    <nav className="bg-gray-800 shadow-lg mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-blue-500">
            🎬 MovieSearch
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `text-lg font-medium transition-colors flex items-center gap-2 ${
                  isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Favorites
              {favoritesCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-lg font-medium transition-colors ${
                  isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/favorites"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-lg font-medium transition-colors flex items-center gap-2 ${
                  isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Favorites
              {favoritesCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}