# Anime Search App

A beautiful, Crunchyroll-inspired single-page application for searching and discovering anime using the Jikan API (MyAnimeList). Built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

## ✨ Features

- 🔍 **Instant Search** - Debounced search with 400ms delay for optimal performance
- 📱 **Responsive Design** - Beautiful on desktop, tablet, and mobile
- 🎨 **Crunchyroll-Inspired UI** - Dark theme with vibrant orange accents
- 📄 **Server-Side Pagination** - Efficient pagination using Jikan API data
- 🔒 **SFW Toggle** - Filter safe-for-work content
- 🎬 **Detailed Anime Pages** - View synopsis, trailers, genres, and more
- ⚡ **Fast & Modern** - Built with Vite and optimized for performance
- 🔄 **Redux State Management** - Predictable state with Redux Toolkit
- 📊 **RTK Query** - Efficient data fetching with caching

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd anime-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:4000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🌐 Deployment

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure SPA redirect: Create a `_redirects` file in `dist`:
```
/*    /index.html   200
```

### Vercel

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Vercel automatically handles SPA routing

## 📁 Project Structure

```
src/
├── app/
│   └── store.ts              # Redux store configuration
├── components/
│   ├── Layout.tsx            # Main layout with header
│   ├── SearchBar.tsx         # Search input with SFW toggle
│   ├── AnimeCard.tsx         # Anime card component
│   ├── AnimeGrid.tsx         # Responsive grid layout
│   ├── Pagination.tsx        # Pagination controls
│   └── SkeletonCard.tsx      # Loading skeletons
├── features/
│   ├── jikan/
│   │   ├── jikanApi.ts       # RTK Query API definition
│   │   └── types.ts          # TypeScript types
│   └── search/
│       └── searchSlice.ts    # Search state management
├── hooks/
│   └── useDebounce.ts        # Debounce hook
├── pages/
│   ├── SearchPage.tsx        # Main search page
│   ├── AnimeDetailPage.tsx   # Anime detail page
│   └── NotFoundPage.tsx      # 404 page
├── App.tsx                   # Main app component
└── main.tsx                  # Entry point
```

## 🎨 Design System

The app uses a custom Crunchyroll-inspired dark theme:

- **Background**: `#0B0C0F` (Deep black)
- **Surface**: `#16181D` (Dark gray)
- **Primary/Accent**: `#F47521` (Vibrant orange)
- **Text**: `#E5E7EB` (Light gray)

## 🔧 Technologies Used

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Data Fetching**: RTK Query
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Icons**: Lucide React
- **API**: Jikan API v4 (MyAnimeList)

## 📝 API Information

This app uses the [Jikan API](https://jikan.moe/), an unofficial MyAnimeList API. Please note:

- **Rate Limits**: The API has rate limits. The app implements debouncing and caching to minimize requests.
- **Cache Duration**: RTK Query keeps unused data for 30 seconds to improve performance.
- **Endpoint**: `https://api.jikan.moe/v4/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) for providing the MyAnimeList data
- [Crunchyroll](https://www.crunchyroll.com/) for design inspiration
- [MyAnimeList](https://myanimelist.net/) for anime data
