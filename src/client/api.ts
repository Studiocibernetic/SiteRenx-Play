// Simulated API functions for the demo
// In a real app, these would make actual HTTP requests

const api = {
  listGames: async (input: { page?: number; limit?: number; search?: string }) => {
    // Simulated response
    return {
      games: [
        {
          id: "1",
          title: "Stuarty",
          description: "Jogo crazy",
          imageUrl: "https://via.placeholder.com/400x600/FF6B6B/FFFFFF?text=Stuarty",
          developer: "Unknown",
          version: "v1.0",
          engine: "REN'PY",
          language: "English",
          rating: 4.5,
          tags: "Adult,Visual Novel",
          downloadUrl: "https://example.com/download",
          downloadUrlWindows: "https://example.com/download/windows",
          downloadUrlAndroid: "https://example.com/download/android",
          downloadUrlLinux: "https://example.com/download/linux",
          downloadUrlMac: "https://example.com/download/mac",
          censored: false,
          installation: "Extract and run",
          changelog: "Initial release",
          devNotes: null,
          releaseDate: new Date("2025-07-13"),
          osWindows: true,
          osAndroid: true,
          osLinux: false,
          osMac: false,
          images: [],
          isFavorited: false,
        },
        {
          id: "2",
          title: "Crazydemonic",
          description: "Kkk",
          imageUrl: "https://via.placeholder.com/400x600/4ECDC4/FFFFFF?text=Crazydemonic",
          developer: "Unknown",
          version: "v1.0",
          engine: "REN'PY",
          language: "English",
          rating: 4.5,
          tags: "Adult,Visual Novel",
          downloadUrl: "https://example.com/download",
          downloadUrlWindows: "https://example.com/download/windows",
          downloadUrlAndroid: "https://example.com/download/android",
          downloadUrlLinux: "https://example.com/download/linux",
          downloadUrlMac: "https://example.com/download/mac",
          censored: false,
          installation: "Extract and run",
          changelog: "Initial release",
          devNotes: null,
          releaseDate: new Date("2025-07-13"),
          osWindows: true,
          osAndroid: true,
          osLinux: false,
          osMac: false,
          images: [],
          isFavorited: false,
        },
        {
          id: "3",
          title: "Kkkk",
          description: "A fun visual novel game",
          imageUrl: "https://via.placeholder.com/400x600/45B7D1/FFFFFF?text=Kkkk",
          developer: "Unknown",
          version: "v1.0",
          engine: "REN'PY",
          language: "English",
          rating: 4.5,
          tags: "Adult,Visual Novel",
          downloadUrl: "https://example.com/download",
          downloadUrlWindows: "https://example.com/download/windows",
          downloadUrlAndroid: "https://example.com/download/android",
          downloadUrlLinux: "https://example.com/download/linux",
          downloadUrlMac: "https://example.com/download/mac",
          censored: false,
          installation: "Extract and run",
          changelog: "Initial release",
          devNotes: null,
          releaseDate: new Date("2025-07-13"),
          osWindows: true,
          osAndroid: true,
          osLinux: false,
          osMac: false,
          images: [],
          isFavorited: false,
        },
      ],
      pagination: {
        page: input.page || 1,
        limit: input.limit || 12,
        total: 3,
        totalPages: 1,
      },
    };
  },

  getGame: async ({ id }: { id: string }) => {
    // Simulated response
    return {
      id,
      title: "Stuarty",
      description: "Jogo crazy",
      imageUrl: "https://via.placeholder.com/400x600/FF6B6B/FFFFFF?text=Stuarty",
      developer: "Unknown",
      version: "v1.0",
      engine: "REN'PY",
      language: "English",
      rating: 4.5,
      tags: "Adult,Visual Novel",
      downloadUrl: "https://example.com/download",
      downloadUrlWindows: "https://example.com/download/windows",
      downloadUrlAndroid: "https://example.com/download/android",
      downloadUrlLinux: "https://example.com/download/linux",
      downloadUrlMac: "https://example.com/download/mac",
      censored: false,
      installation: "Extract and run",
      changelog: "Initial release",
      devNotes: null,
      releaseDate: new Date("2025-07-13"),
      osWindows: true,
      osAndroid: true,
      osLinux: false,
      osMac: false,
      images: [],
      isFavorited: false,
    };
  },

  createGame: async (data: any) => {
    // Simulated response
    return { id: "new-game-id", ...data };
  },

  updateGame: async (data: any) => {
    // Simulated response
    return data;
  },

  deleteGame: async ({ id }: { id: string }) => {
    // Simulated response
    return { id };
  },

  getAdminStatus: async () => {
    // Simulated response
    return { isAdmin: true };
  },

  setUserAsAdmin: async () => {
    // Simulated response
    return { success: true };
  },

  addToFavorites: async ({ gameId }: { gameId: string }) => {
    // Simulated response
    return { gameId, userId: "user-id" };
  },

  removeFromFavorites: async ({ gameId }: { gameId: string }) => {
    // Simulated response
    return { gameId, userId: "user-id" };
  },

  uploadGameImage: async (data: any) => {
    // Simulated response
    return { id: "image-id", gameId: data.gameId, imageUrl: data.base64 };
  },

  getGameImages: async ({ gameId }: { gameId: string }) => {
    // Simulated response
    return [
      { id: "1", gameId, imageUrl: "https://via.placeholder.com/400x600/FF6B6B/FFFFFF?text=Screenshot+1" },
      { id: "2", gameId, imageUrl: "https://via.placeholder.com/400x600/4ECDC4/FFFFFF?text=Screenshot+2" },
    ];
  },

  deleteGameImage: async ({ id }: { id: string }) => {
    // Simulated response
    return { id };
  },
};

export const apiClient = {
  listGames: api.listGames,
  getGame: api.getGame,
  createGame: api.createGame,
  updateGame: api.updateGame,
  deleteGame: api.deleteGame,
  getAdminStatus: api.getAdminStatus,
  setUserAsAdmin: api.setUserAsAdmin,
  addToFavorites: api.addToFavorites,
  removeFromFavorites: api.removeFromFavorites,
  uploadGameImage: api.uploadGameImage,
  getGameImages: api.getGameImages,
  deleteGameImage: api.deleteGameImage,
};