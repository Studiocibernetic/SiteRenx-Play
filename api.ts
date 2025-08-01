import { db } from "~/server/db";
import { getAuth, upload } from "~/server/actions";

// Game Management
export async function listGames(input: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = input.page || 1;
  const limit = input.limit || 12;
  const offset = (page - 1) * limit;

  const where = input.search
    ? {
        OR: [
          { title: { contains: input.search } },
          { description: { contains: input.search } },
          { tags: { contains: input.search } },
          { developer: { contains: input.search } },
        ],
      }
    : {};

  const [games, total] = await Promise.all([
    db.game.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    db.game.count({ where }),
  ]);

  return {
    games,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getGame({ id }: { id: string }) {
  const { userId } = await getAuth({ required: false });

  const game = await db.game.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  let isFavorited = false;
  if (userId) {
    const favorite = await db.favorite.findUnique({
      where: {
        gameId_userId: {
          gameId: id,
          userId,
        },
      },
    });
    isFavorited = !!favorite;
  }

  return {
    ...game,
    isFavorited,
  };
}

export async function createGame(input: {
  title: string;
  description: string;
  imageUrl: string;
  developer?: string;
  version?: string;
  engine?: string;
  language?: string;
  rating?: number;
  tags?: string;
  downloadUrl?: string;
  downloadUrlWindows?: string;
  downloadUrlAndroid?: string;
  downloadUrlLinux?: string;
  downloadUrlMac?: string;
  censored?: boolean;
  installation?: string;
  changelog?: string;
  devNotes?: string;
  osWindows?: boolean;
  osAndroid?: boolean;
  osLinux?: boolean;
  osMac?: boolean;
}) {
  const { userId } = await getAuth({ required: true });
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return await db.game.create({
    data: {
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
      osWindows: input.osWindows !== undefined ? input.osWindows : true,
      osAndroid: input.osAndroid || false,
      osLinux: input.osLinux || false,
      osMac: input.osMac || false,
    },
  });
}

export async function updateGame(input: {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  developer?: string;
  version?: string;
  engine?: string;
  language?: string;
  rating?: number;
  tags?: string;
  downloadUrl?: string;
  downloadUrlWindows?: string;
  downloadUrlAndroid?: string;
  downloadUrlLinux?: string;
  downloadUrlMac?: string;
  censored?: boolean;
  installation?: string;
  changelog?: string;
  devNotes?: string;
  osWindows?: boolean;
  osAndroid?: boolean;
  osLinux?: boolean;
  osMac?: boolean;
}) {
  const { userId } = await getAuth({ required: true });
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  const { id, ...updateData } = input;
  return await db.game.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteGame({ id }: { id: string }) {
  const { userId } = await getAuth({ required: true });
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return await db.game.delete({
    where: { id },
  });
}

// User Management
export async function getAdminStatus() {
  const { userId } = await getAuth({ required: false });

  if (!userId) {
    return { isAdmin: false };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  return { isAdmin: user?.isAdmin || false };
}

export async function setUserAsAdmin() {
  const { userId } = await getAuth({ required: true });

  await db.user.upsert({
    where: { id: userId },
    update: { isAdmin: true },
    create: { id: userId, isAdmin: true },
  });

  return { success: true };
}

// Favorites
export async function addToFavorites({ gameId }: { gameId: string }) {
  const { userId } = await getAuth({ required: true });

  return await db.favorite.create({
    data: {
      gameId,
      userId,
    },
  });
}

export async function removeFromFavorites({ gameId }: { gameId: string }) {
  const { userId } = await getAuth({ required: true });

  return await db.favorite.delete({
    where: {
      gameId_userId: {
        gameId,
        userId,
      },
    },
  });
}

// Image Management
export async function uploadGameImage(input: {
  gameId: string;
  base64: string;
  fileName: string;
}) {
  const { userId } = await getAuth({ required: true });
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  const imageUrl = await upload({
    bufferOrBase64: input.base64,
    fileName: `game-images/${input.gameId}/${Date.now()}-${input.fileName}`,
  });

  return await db.gameImage.create({
    data: {
      gameId: input.gameId,
      imageUrl,
    },
  });
}

export async function getGameImages({ gameId }: { gameId: string }) {
  return await db.gameImage.findMany({
    where: { gameId },
    orderBy: { id: "desc" },
  });
}

export async function deleteGameImage({ id }: { id: string }) {
  const { userId } = await getAuth({ required: true });
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return await db.gameImage.delete({
    where: { id },
  });
}

// Seed function to make the app creator an admin
export async function _seedAppCreatorAsAdmin() {
  const builderId = "nfaCXmKh4XdVdt9K";

  await db.user.upsert({
    where: { id: builderId },
    update: { isAdmin: true },
    create: { id: builderId, isAdmin: true },
  });

  console.log("App creator has been granted admin privileges");
}
