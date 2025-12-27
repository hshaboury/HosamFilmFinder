import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (isMenuOpen && event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`bg-gradient-to-r from-[#0f172a] to-[#020617]/10
      shadow-lg mb-8 sticky top-0 z-50 transition-shadow duration-300
      ${isSticky ? 'shadow-2xl' : ''}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-xl sm:text-2xl font-bold
              bg-gradient-to-r from-blue-400 to-violet-500
              bg-clip-text text-transparent
              hover:opacity-90 transition"
          >
            🎬 MovieSearch
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-medium transition-colors min-h-[44px]
                 flex items-center rounded px-2
                 ${
                   isActive
                     ? 'text-blue-400'
                     : 'text-gray-300 hover:text-white'
                 }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `text-lg font-medium transition-colors
                 flex items-center gap-2 min-h-[44px]
                 rounded px-2
                 ${
                   isActive
                     ? 'text-pink-400'
                     : 'text-gray-300 hover:text-white'
                 }`
              }
            >
              Favorites
              {favoritesCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold
                  px-2 py-1 rounded-full min-w-[24px] text-center">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white min-w-[44px] min-h-[44px]
              flex items-center justify-center
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-blue-500 rounded
              active:scale-95 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isMenuOpen ? 'rotate-90' : ''
              }`}
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

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-16 right-0 bottom-0 w-64
            bg-gradient-to-b from-[#0f172a] to-[#020617]
            shadow-2xl z-50 md:hidden
            transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col p-4 space-y-2">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block py-3 px-4 text-lg font-medium rounded-lg transition-colors
                 ${
                   isActive
                     ? 'text-blue-400 bg-white/10'
                     : 'text-gray-300 hover:text-white hover:bg-white/10'
                 }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/favorites"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block py-3 px-4 text-lg font-medium
                 flex items-center justify-between
                 rounded-lg transition-colors
                 ${
                   isActive
                     ? 'text-pink-400 bg-white/10'
                     : 'text-gray-300 hover:text-white hover:bg-white/10'
                 }`
              }
            >
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold
                  px-2 py-1 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}