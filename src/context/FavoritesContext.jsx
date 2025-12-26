import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.imdbID === movie.imdbID)) {
        return prev;
      }
      return [...prev, { ...movie, addedAt: Date.now() }];
    });
  };

  const removeFavorite = (imdbId) => {
    setFavorites((prev) => prev.filter((movie) => movie.imdbID !== imdbId));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  const isFavorite = (imdbId) => {
    return favorites.some((movie) => movie.imdbID === imdbId);
  };

  const getFavoritesSorted = (sortBy, order = 'desc') => {
    const sorted = [...favorites];
    
    switch (sortBy) {
      case 'dateAdded':
        sorted.sort((a, b) => {
          const timeA = a.addedAt || 0;
          const timeB = b.addedAt || 0;
          return order === 'desc' ? timeB - timeA : timeA - timeB;
        });
        break;
      case 'title':
        sorted.sort((a, b) => {
          const titleA = a.Title.toLowerCase();
          const titleB = b.Title.toLowerCase();
          return order === 'asc' 
            ? titleA.localeCompare(titleB) 
            : titleB.localeCompare(titleA);
        });
        break;
      case 'year':
        sorted.sort((a, b) => {
          const yearA = parseInt(a.Year) || 0;
          const yearB = parseInt(b.Year) || 0;
          return order === 'desc' ? yearB - yearA : yearA - yearB;
        });
        break;
      default:
        break;
    }
    
    return sorted;
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{ 
        favorites, 
        addFavorite, 
        removeFavorite, 
        clearAllFavorites,
        isFavorite,
        getFavoritesSorted,
        favoritesCount
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}