// Mock API client that simulates backend functionality
type Game = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  developer: string;
  version: string;
  engine: string;
  language: string;
  rating: number;
  tags: string;
  downloadUrl?: string | null;
  downloadUrlWindows?: string | null;
  downloadUrlAndroid?: string | null;
  downloadUrlLinux?: string | null;
  downloadUrlMac?: string | null;
  censored: boolean;
  installation: string;
  changelog: string;
  devNotes?: string | null;
  releaseDate: string | Date;
  osWindows: boolean;
  osAndroid: boolean;
  osLinux: boolean;
  osMac: boolean;
  images?: Array<{ id: string; imageUrl: string }>;
  isFavorited?: boolean;
};

// Mock data storage
let mockGames: Game[] = [
  {
    id: "1",
    title: "Kkkk",
    description: "Jogo crazy",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    developer: "Unknown",
    version: "v1.0",
    engine: "REN'PY",
    language: "English",
    rating: 4.5,
    tags: "Adult,Visual Novel",
    downloadUrl: "#",
    downloadUrlWindows: "#",
    downloadUrlAndroid: "#",
    downloadUrlLinux: "#",
    downloadUrlMac: "#",
    censored: false,
    installation: "Extract and run",
    changelog: "Initial release",
    devNotes: "This is a sample game for demonstration purposes.",
    releaseDate: "2025-07-13",
    osWindows: true,
    osAndroid: false,
    osLinux: false,
    osMac: false,
    images: [
      { id: "img1", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop" },
      { id: "img2", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop" },
      { id: "img3", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop" },
      { id: "img4", imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop" },
    ],
    isFavorited: false,
  },
  {
    id: "2",
    title: "Stuarty",
    description: "Jogo crazy",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    developer: "Unknown",
    version: "v1.0",
    engine: "REN'PY",
    language: "English",
    rating: 4.5,
    tags: "Adult,Visual Novel",
    downloadUrl: "#",
    downloadUrlWindows: "#",
    downloadUrlAndroid: "#",
    downloadUrlLinux: "#",
    downloadUrlMac: "#",
    censored: false,
    installation: "Extract and run",
    changelog: "Initial release",
    devNotes: "Another sample game for demonstration.",
    releaseDate: "2025-07-13",
    osWindows: true,
    osAndroid: false,
    osLinux: false,
    osMac: false,
    images: [
      { id: "img5", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop" },
      { id: "img6", imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop" },
    ],
    isFavorited: false,
  },
  {
    id: "3",
    title: "Crazydemonic",
    description: "Kkk",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    developer: "Unknown",
    version: "v1.0",
    engine: "REN'PY",
    language: "English",
    rating: 4.5,
    tags: "Adult,Visual Novel",
    downloadUrl: "#",
    downloadUrlWindows: "#",
    downloadUrlAndroid: "#",
    downloadUrlLinux: "#",
    downloadUrlMac: "#",
    censored: false,
    installation: "Extract and run",
    changelog: "Initial release",
    devNotes: null,
    releaseDate: "2025-07-13",
    osWindows: true,
    osAndroid: false,
    osLinux: false,
    osMac: false,
    images: [
      { id: "img7", imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop" },
    ],
    isFavorited: false,
  },
];

let mockImages: Array<{ id: string; gameId: string; imageUrl: string }> = [];
let mockFavorites: Array<{ gameId: string; userId: string }> = [];
let isAdmin = true;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  // Game Management
  async listGames(input: { page?: number; limit?: number; search?: string }) {
    await delay(300);
    
    const page = input.page || 1;
    const limit = input.limit || 12;
    const search = input.search?.toLowerCase() || "";
    
    let filteredGames = mockGames;
    
    if (search) {
      filteredGames = mockGames.filter(game => 
        game.title.toLowerCase().includes(search) ||
        game.description.toLowerCase().includes(search) ||
        game.tags.toLowerCase().includes(search) ||
        game.developer.toLowerCase().includes(search)
      );
    }
    
    const total = filteredGames.length;
    const offset = (page - 1) * limit;
    const games = filteredGames.slice(offset, offset + limit);
    
    return {
      games,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getGame({ id }: { id: string }) {
    await delay(200);
    
    const game = mockGames.find(g => g.id === id);
    if (!game) {
      throw new Error("Game not found");
    }
    
    const isFavorited = mockFavorites.some(f => f.gameId === id);
    
    return {
      ...game,
      isFavorited,
    };
  },

  async createGame(input: any) {
    await delay(500);
    
    const newGame: Game = {
      id: Date.now().toString(),
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      developer: input.developer || "Unknown",
      version: input.version || "v1.0",
      engine: input.engine || "REN'PY",
      language: input.language || "English",
      rating: input.rating || 4.5,
      tags: input.tags || "Adult,Visual Novel",
      downloadUrl: input.downloadUrl,
      downloadUrlWindows: input.downloadUrlWindows,
      downloadUrlAndroid: input.downloadUrlAndroid,
      downloadUrlLinux: input.downloadUrlLinux,
      downloadUrlMac: input.downloadUrlMac,
      censored: input.censored || false,
      installation: input.installation || "Extract and run",
      changelog: input.changelog || "Initial release",
      devNotes: input.devNotes,
      releaseDate: new Date().toISOString(),
      osWindows: input.osWindows !== undefined ? input.osWindows : true,
      osAndroid: input.osAndroid || false,
      osLinux: input.osLinux || false,
      osMac: input.osMac || false,
      images: [],
    };
    
    mockGames.unshift(newGame);
    return newGame;
  },

  async updateGame(input: any) {
    await delay(500);
    
    const gameIndex = mockGames.findIndex(g => g.id === input.id);
    if (gameIndex === -1) {
      throw new Error("Game not found");
    }
    
    const { id, ...updateData } = input;
    mockGames[gameIndex] = { ...mockGames[gameIndex], ...updateData };
    
    return mockGames[gameIndex];
  },

  async deleteGame({ id }: { id: string }) {
    await delay(300);
    
    const gameIndex = mockGames.findIndex(g => g.id === id);
    if (gameIndex === -1) {
      throw new Error("Game not found");
    }
    
    mockGames.splice(gameIndex, 1);
    mockImages = mockImages.filter(img => img.gameId !== id);
    mockFavorites = mockFavorites.filter(f => f.gameId !== id);
    
    return { success: true };
  },

  // User Management
  async getAdminStatus() {
    await delay(100);
    return { isAdmin };
  },

  async setUserAsAdmin() {
    await delay(200);
    isAdmin = true;
    return { success: true };
  },

  // Favorites
  async addToFavorites({ gameId }: { gameId: string }) {
    await delay(200);
    
    if (!mockFavorites.some(f => f.gameId === gameId)) {
      mockFavorites.push({ gameId, userId: "mock-user" });
    }
    
    return { success: true };
  },

  async removeFromFavorites({ gameId }: { gameId: string }) {
    await delay(200);
    
    mockFavorites = mockFavorites.filter(f => f.gameId !== gameId);
    
    return { success: true };
  },

  // Image Management
  async uploadGameImage(input: { gameId: string; base64: string; fileName: string }) {
    await delay(800);
    
    // In a real app, this would upload to a storage service
    // For demo, we'll use a placeholder image
    const newImage = {
      id: Date.now().toString(),
      gameId: input.gameId,
      imageUrl: `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`,
    };
    
    mockImages.push(newImage);
    
    // Update game's images array
    const game = mockGames.find(g => g.id === input.gameId);
    if (game) {
      if (!game.images) game.images = [];
      game.images.push(newImage);
    }
    
    return newImage;
  },

  async getGameImages({ gameId }: { gameId: string }) {
    await delay(200);
    
    return mockImages.filter(img => img.gameId === gameId);
  },

  async deleteGameImage({ id }: { id: string }) {
    await delay(300);
    
    const imageIndex = mockImages.findIndex(img => img.id === id);
    if (imageIndex === -1) {
      throw new Error("Image not found");
    }
    
    const image = mockImages[imageIndex];
    mockImages.splice(imageIndex, 1);
    
    // Update game's images array
    const game = mockGames.find(g => g.id === image.gameId);
    if (game && game.images) {
      game.images = game.images.filter(img => img.id !== id);
    }
    
    return { success: true };
  },
};