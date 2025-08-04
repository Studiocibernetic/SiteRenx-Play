import jwt from "jsonwebtoken";
import { db } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "renx-play-secret-key";

export interface UsuarioAutenticado {
  id: string;
  nome?: string;
  ehAdmin: boolean;
}

export async function criarToken(usuario: UsuarioAutenticado): Promise<string> {
  return jwt.sign(usuario, JWT_SECRET, { expiresIn: "7d" });
}

export async function verificarToken(token: string): Promise<UsuarioAutenticado | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UsuarioAutenticado;
    return decoded;
  } catch {
    return null;
  }
}

export async function obterAutenticacaoReal(params: { obrigatorio?: boolean } = {}): Promise<{ idUsuario: string } | null> {
  // Em produção, isso viria do header Authorization
  const token = "usuario-teste-123"; // Simulado para desenvolvimento
  
  if (!token) {
    if (params.obrigatorio) {
      throw new Error("Não autorizado");
    }
    return null;
  }

  // Verificar se o usuário existe no banco
  const usuario = await db.usuario.findUnique({
    where: { id: token },
  });

  if (!usuario) {
    // Criar usuário padrão se não existir
    await db.usuario.create({
      data: {
        id: token,
        nome: "Usuário Teste",
        ehAdmin: false,
      },
    });
  }

  return { idUsuario: token };
}

export async function verificarAdminReal(idUsuario: string): Promise<boolean> {
  const usuario = await db.usuario.findUnique({
    where: { id: idUsuario },
    select: { ehAdmin: true },
  });

  return usuario?.ehAdmin || false;
}