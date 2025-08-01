# Renx-Play - Game Platform

A modern, responsive game platform built with React, TypeScript, and Tailwind CSS. This application allows users to browse, search, and manage games with features like favorites, admin dashboard, and image galleries.

## Features

- 🎮 **Game Browsing**: Browse games with search and pagination
- 🔍 **Search**: Real-time search across game titles, descriptions, and tags
- ⭐ **Ratings**: Star-based rating system for games
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 👤 **Admin Panel**: Comprehensive admin dashboard for game management
- 🖼️ **Image Gallery**: Upload and manage multiple images per game
- 📥 **Multi-Platform Downloads**: Support for Windows, Android, Linux, and Mac
- ❤️ **Favorites**: Save favorite games (mock authentication)

## Screenshots

The application recreates the design shown in the provided screenshots with:
- Clean, modern card-based layout
- Game detail pages with platform selection
- Admin dashboard for content management
- Image gallery management
- Dark/light theme support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom CSS Variables
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript strict mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd renx-play
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

### For Users

1. **Browse Games**: Visit the homepage to see all available games
2. **Search**: Use the search bar to find specific games
3. **View Details**: Click on any game card to see detailed information
4. **Select Platform**: Choose your platform (Windows, Android, Linux, Mac) for downloads
5. **Toggle Theme**: Use the user menu to switch between light and dark themes

### For Admins

1. **Access Admin Panel**: Click on "Admin" in the navigation (auto-granted for demo)
2. **Add Games**: Use the "Add Game" button to create new games
3. **Edit Games**: Click "Edit" on any game card to modify details
4. **Manage Images**: Use "Imagens" button to upload/delete game screenshots
5. **Delete Games**: Remove games using the "Delete" button

## Project Structure

```
src/
├── components/
│   └── ui/                 # Reusable UI components
├── client/
│   ├── api.ts             # Mock API client
│   └── utils.ts           # Utility functions
├── lib/
│   └── utils.ts           # Class name utilities
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles and theme
```

## Data & State

This application uses a **mock API system** for demonstration purposes:

- **Games**: Pre-populated with sample games matching the screenshots
- **Authentication**: Mock authentication (always authenticated)
- **Admin Access**: Automatically granted for demo purposes
- **File Uploads**: Simulated with placeholder images
- **Persistence**: Data resets on page refresh (in-memory storage)

For production use, you would replace the mock API client with real backend integration.

## Customization

### Adding New Games

Use the admin panel to add games with:
- Title, description, and developer info
- Cover image URL
- Platform support (Windows, Android, Linux, Mac)
- Download links per platform
- Tags and ratings
- Additional screenshots

### Theming

The application supports extensive theming through CSS variables:
- Colors are defined in `src/index.css`
- Dark mode automatically switches variable values
- Tailwind classes use these variables for consistency

### Extending Features

The modular architecture makes it easy to add:
- User authentication system
- Real database integration
- Payment processing
- Social features
- Advanced filtering

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is provided as-is for demonstration purposes.

## Demo Data

The application includes sample games that match the provided screenshots:
- "Kkkk" - Sample visual novel game
- "Stuarty" - Another sample game
- "Crazydemonic" - Third sample game

All games include placeholder data, images, and download links for demonstration.