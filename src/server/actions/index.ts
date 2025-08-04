import { db } from "../db";
import { obterAutenticacao, verificarAdmin } from "../auth";

// Gerenciamento de Jogos
export async function listarJogos(input: {
  pagina?: number;
  limite?: number;
  busca?: string;
}) {
  const pagina = input.pagina || 1;
  const limite = input.limite || 12;
  const offset = (pagina - 1) * limite;

  const where = input.busca
    ? {
        OR: [
          { titulo: { contains: input.busca } },
          { descricao: { contains: input.busca } },
          { tags: { contains: input.busca } },
          { desenvolvedor: { contains: input.busca } },
        ],
      }
    : {};

  const [jogos, total] = await Promise.all([
    db.jogo.findMany({
      where,
      orderBy: { dataCriacao: "desc" },
      skip: offset,
      take: limite,
    }),
    db.jogo.count({ where }),
  ]);

  return {
    jogos,
    paginacao: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
}

export async function obterJogo({ id }: { id: string }) {
  const auth = await obterAutenticacao({ obrigatorio: false });
  const idUsuario = auth?.idUsuario;

  const jogo = await db.jogo.findUnique({
    where: { id },
    include: {
      imagens: true,
    },
  });

  if (!jogo) {
    throw new Error("Jogo não encontrado");
  }

  let favoritado = false;
  if (idUsuario) {
    const favorito = await db.favorito.findUnique({
      where: {
        idJogo_idUsuario: {
          idJogo: id,
          idUsuario,
        },
      },
    });
    favoritado = !!favorito;
  }

  return {
    ...jogo,
    favoritado,
  };
}

export async function criarJogo(input: {
  titulo: string;
  descricao: string;
  urlImagem: string;
  desenvolvedor?: string;
  versao?: string;
  engine?: string;
  idioma?: string;
  avaliacao?: number;
  tags?: string;
  urlDownload?: string;
  urlDownloadWindows?: string;
  urlDownloadAndroid?: string;
  urlDownloadLinux?: string;
  urlDownloadMac?: string;
  censurado?: boolean;
  instalacao?: string;
  changelog?: string;
  notasDev?: string;
  osWindows?: boolean;
  osAndroid?: boolean;
  osLinux?: boolean;
  osMac?: boolean;
}) {
  const auth = await obterAutenticacao({ obrigatorio: true });
  const idUsuario = auth?.idUsuario;
  if (!idUsuario) throw new Error("Não autorizado");
  
  const usuario = await db.usuario.findUnique({ where: { id: idUsuario } });

  if (!usuario?.ehAdmin) {
    throw new Error("Não autorizado: Acesso de admin necessário");
  }

  return await db.jogo.create({
    data: {
      titulo: input.titulo,
      descricao: input.descricao,
      urlImagem: input.urlImagem,
      desenvolvedor: input.desenvolvedor || "Unknown",
      versao: input.versao || "v1.0",
      engine: input.engine || "REN'PY",
      idioma: input.idioma || "English",
      avaliacao: input.avaliacao || 4.5,
      tags: input.tags || "Adult,Visual Novel",
      urlDownload: input.urlDownload,
      urlDownloadWindows: input.urlDownloadWindows,
      urlDownloadAndroid: input.urlDownloadAndroid,
      urlDownloadLinux: input.urlDownloadLinux,
      urlDownloadMac: input.urlDownloadMac,
      censurado: input.censurado || false,
      instalacao: input.instalacao || "Extrair e executar",
      changelog: input.changelog || "Lançamento inicial",
      notasDev: input.notasDev,
      osWindows: input.osWindows !== undefined ? input.osWindows : true,
      osAndroid: input.osAndroid || false,
      osLinux: input.osLinux || false,
      osMac: input.osMac || false,
    },
  });
}

export async function atualizarJogo(input: {
  id: string;
  titulo?: string;
  descricao?: string;
  urlImagem?: string;
  desenvolvedor?: string;
  versao?: string;
  engine?: string;
  idioma?: string;
  avaliacao?: number;
  tags?: string;
  urlDownload?: string;
  urlDownloadWindows?: string;
  urlDownloadAndroid?: string;
  urlDownloadLinux?: string;
  urlDownloadMac?: string;
  censurado?: boolean;
  instalacao?: string;
  changelog?: string;
  notasDev?: string;
  osWindows?: boolean;
  osAndroid?: boolean;
  osLinux?: boolean;
  osMac?: boolean;
}) {
  const auth = await obterAutenticacao({ obrigatorio: true });
  const idUsuario = auth?.idUsuario;
  if (!idUsuario) throw new Error("Não autorizado");
  
  const usuario = await db.usuario.findUnique({ where: { id: idUsuario } });

  if (!usuario?.ehAdmin) {
    throw new Error("Não autorizado: Acesso de admin necessário");
  }

  const { id, ...dadosAtualizacao } = input;
  return await db.jogo.update({
    where: { id },
    data: dadosAtualizacao,
  });
}

export async function deletarJogo({ id }: { id: string }) {
  const auth = await obterAutenticacao({ obrigatorio: true });
  const idUsuario = auth?.idUsuario;
  if (!idUsuario) throw new Error("Não autorizado");
  
  const usuario = await db.usuario.findUnique({ where: { id: idUsuario } });

  if (!usuario?.ehAdmin) {
    throw new Error("Não autorizado: Acesso de admin necessário");
  }

  return await db.jogo.delete({
    where: { id },
  });
}

// Gerenciamento de Usuários
export async function obterStatusAdmin() {
  const auth = await obterAutenticacao({ obrigatorio: false });
  const idUsuario = auth?.idUsuario;

  if (!idUsuario) {
    return { ehAdmin: false };
  }

  const usuario = await db.usuario.findUnique({
    where: { id: idUsuario },
    select: { ehAdmin: true },
  });

  return { ehAdmin: usuario?.ehAdmin || false };
}

export async function definirUsuarioComoAdmin() {
  const auth = await obterAutenticacao({ obrigatorio: true });
  const idUsuario = auth?.idUsuario;
  if (!idUsuario) throw new Error("Não autorizado");

  await db.usuario.upsert({
    where: { id: idUsuario },
    update: { ehAdmin: true },
    create: { id: idUsuario, ehAdmin: true },
  });

  return { success: true };
}

// Favoritos
export async function adicionarAosFavoritos({ idJogo }: { idJogo: string }) {
  const auth = await obterAutenticacao({ obrigatorio: true });
  const idUsuario = auth?.idUsuario;
  if (!idUsuario) throw new Error("Não autorizado");

  return await db.favorito.create({
    data: {
      idJogo,
      idUsuario,
    },
  });
}

export async function removerDosFavoritos({ idJogo }: { idJogo: string }) {
  const auth = await obterAutenticacao({ obrigatorio: true });
  const idUsuario = auth?.idUsuario;
  if (!idUsuario) throw new Error("Não autorizado");

  return await db.favorito.delete({
    where: {
      idJogo_idUsuario: {
        idJogo,
        idUsuario,
      },
    },
  });
}

// Gerenciamento de Imagens
export async function enviarImagemJogo(input: {
  idJogo: string;
  base64: string;
  nomeArquivo: string;
}) {
  const auth = await obterAutenticacao({ obrigatorio: true });
  const idUsuario = auth?.idUsuario;
  if (!idUsuario) throw new Error("Não autorizado");
  
  const usuario = await db.usuario.findUnique({ where: { id: idUsuario } });

  if (!usuario?.ehAdmin) {
    throw new Error("Não autorizado: Acesso de admin necessário");
  }

  // Em produção, aqui seria feito upload para um serviço como AWS S3, Cloudinary, etc.
  const urlImagem = `https://via.placeholder.com/400x300?text=${encodeURIComponent(input.nomeArquivo)}`;

  return await db.imagemJogo.create({
    data: {
      idJogo: input.idJogo,
      urlImagem,
    },
  });
}

export async function obterImagensJogo({ idJogo }: { idJogo: string }) {
  return await db.imagemJogo.findMany({
    where: { idJogo },
    orderBy: { id: "desc" },
  });
}

export async function deletarImagemJogo({ id }: { id: string }) {
  const auth = await obterAutenticacao({ obrigatorio: true });
  const idUsuario = auth?.idUsuario;
  if (!idUsuario) throw new Error("Não autorizado");
  
  const usuario = await db.usuario.findUnique({ where: { id: idUsuario } });

  if (!usuario?.ehAdmin) {
    throw new Error("Não autorizado: Acesso de admin necessário");
  }

  return await db.imagemJogo.delete({
    where: { id },
  });
}

// Função para popular o banco com dados de exemplo
export async function popularBancoComExemplos() {
  const jogosExemplo = [
    {
      titulo: "Seilork",
      descricao: "Um jogo visual novel emocionante com gráficos impressionantes e uma história envolvente que vai te manter preso à tela por horas.",
      urlImagem: "https://via.placeholder.com/600x800",
      desenvolvedor: "Qlbae",
      versao: "v1.0",
      engine: "REN'PY",
      idioma: "English",
      avaliacao: 4.5,
      tags: "Adult,Visual Novel",
      urlDownload: "https://example.com/download",
      urlDownloadWindows: "https://example.com/windows",
      urlDownloadAndroid: "https://example.com/android",
      censurado: false,
      instalacao: "Extrair e executar",
      changelog: "Lançamento inicial",
      notasDev: "Este é um projeto experimental. Comentários são bem-vindos!",
      osWindows: true,
      osAndroid: true,
      osLinux: false,
      osMac: false,
    },
    {
      titulo: "Qlbae",
      descricao: "Outro jogo visual novel incrível com mecânicas únicas e personagens memoráveis.",
      urlImagem: "https://via.placeholder.com/600x800",
      desenvolvedor: "Unknown",
      versao: "v1.0",
      engine: "REN'PY",
      idioma: "English",
      avaliacao: 4.5,
      tags: "Adult,Visual Novel",
      urlDownload: "https://example.com/download2",
      urlDownloadWindows: "https://example.com/windows2",
      urlDownloadAndroid: "https://example.com/android2",
      censurado: false,
      instalacao: "Extrair e executar",
      changelog: "Lançamento inicial",
      osWindows: true,
      osAndroid: true,
      osLinux: false,
      osMac: false,
    },
  ];

  for (const jogo of jogosExemplo) {
    await db.jogo.create({
      data: jogo,
    });
  }

  console.log("Banco populado com dados de exemplo!");
}