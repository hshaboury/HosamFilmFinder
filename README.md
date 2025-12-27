# 🎬 Movie Search App

A modern, responsive movie search application built with React, Vite, and Tailwind CSS. Search for movies, view detailed information, and save your favorites!

## ✨ Features

- **Search Movies** - Search for movies using the OMDb API
- **Detailed Information** - View comprehensive movie details including plot, cast, ratings, and more
- **Favorites** - Save your favorite movies with persistent local storage
- **Responsive Design** - Fully responsive UI that works on all devices
- **Modern UI** - Clean, dark-themed interface with smooth animations
- **Fast Performance** - Built with Vite for lightning-fast development and optimized builds

## 🛠️ Tech Stack

- **React** - UI library for building interactive interfaces
- **Vite** - Next-generation frontend build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **OMDb API** - Movie database API

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Navigation bar with logo and links
│   ├── SearchBar.jsx     # Search input with button
│   ├── MovieCard.jsx     # Individual movie card display
│   ├── MovieList.jsx     # Grid of MovieCard components
│   ├── Loader.jsx        # Loading spinner component
│   └── Error.jsx         # Error message component
├── pages/
│   ├── Home.jsx          # Home page with search and movie grid
│   ├── MovieDetails.jsx  # Detailed movie information page
│   └── Favorites.jsx     # Favorites list page
├── services/
│   └── api.js            # OMDb API service functions
├── context/
│   └── FavoritesContext.jsx  # Context for managing favorites state
├── App.jsx               # Main app with routing
├── main.jsx              # Entry point
└── index.css             # Tailwind CSS imports and global styles
```

## 🤖 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OMDb API Key (Get one free at [OMDb API](http://www.omdbapi.com/apikey.aspx))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hshaboury/movie-search-app.git
   cd movie-search-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Add your OMDb API key to the `.env` file:
   ```
   VITE_OMDB_API_KEY=your_actual_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and visit `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Live Demo

[View Live Demo](https://hosam-film-finder.vercel.app)

## 🎯 Usage

1. **Search for Movies** - Enter a movie title in the search bar on the home page
2. **View Details** - Click on any movie card to see detailed information
3. **Add to Favorites** - Click the heart button on the movie details page to save to favorites
4. **View Favorites** - Navigate to the Favorites page from the navigation menu

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is open source and available under the MIT License.