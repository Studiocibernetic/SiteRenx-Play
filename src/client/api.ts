// Cliente da API simulado
export const clienteApi = {
  // Listar jogos
  listarJogos: async (params: { pagina?: number; limite?: number; busca?: string }) => {
    // Simular dados de exemplo
    const jogos = [
      {
        id: "1",
        titulo: "Seilork",
        descricao: "Um jogo visual novel emocionante",
        urlImagem: "https://via.placeholder.com/300x400",
        desenvolvedor: "Qlbae",
        versao: "v1.0",
        engine: "REN'PY",
        idioma: "English",
        avaliacao: 4.5,
        tags: "Adult,Visual Novel",
        urlDownload: "https://example.com/download",
        urlDownloadWindows: "https://example.com/windows",
        urlDownloadAndroid: "https://example.com/android",
        urlDownloadLinux: null,
        urlDownloadMac: null,
        censurado: false,
        instalacao: "Extrair e executar",
        changelog: "Lançamento inicial",
        notasDev: null,
        dataLancamento: new Date("2025-07-13"),
        osWindows: true,
        osAndroid: true,
        osLinux: false,
        osMac: false,
        imagens: [],
        favoritado: false,
      },
      {
        id: "2",
        titulo: "Qlbae",
        descricao: "Outro jogo visual novel incrível",
        urlImagem: "https://via.placeholder.com/300x400",
        desenvolvedor: "Unknown",
        versao: "v1.0",
        engine: "REN'PY",
        idioma: "English",
        avaliacao: 4.5,
        tags: "Adult,Visual Novel",
        urlDownload: "https://example.com/download2",
        urlDownloadWindows: "https://example.com/windows2",
        urlDownloadAndroid: "https://example.com/android2",
        urlDownloadLinux: null,
        urlDownloadMac: null,
        censurado: false,
        instalacao: "Extrair e executar",
        changelog: "Lançamento inicial",
        notasDev: null,
        dataLancamento: new Date("2025-07-13"),
        osWindows: true,
        osAndroid: true,
        osLinux: false,
        osMac: false,
        imagens: [],
        favoritado: false,
      },
    ]

    return {
      jogos: jogos.filter(jogo => 
        !params.busca || 
        jogo.titulo.toLowerCase().includes(params.busca.toLowerCase()) ||
        jogo.descricao.toLowerCase().includes(params.busca.toLowerCase())
      ),
      paginacao: {
        pagina: params.pagina || 1,
        limite: params.limite || 12,
        total: jogos.length,
        totalPaginas: Math.ceil(jogos.length / (params.limite || 12)),
      },
    }
  },

  // Obter jogo específico
  obterJogo: async (params: { id: string }) => {
    const jogos = [
      {
        id: "1",
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
        urlDownloadLinux: null,
        urlDownloadMac: null,
        censurado: false,
        instalacao: "Extrair e executar",
        changelog: "Lançamento inicial",
        notasDev: "Este é um projeto experimental. Comentários são bem-vindos!",
        dataLancamento: new Date("2025-07-13"),
        osWindows: true,
        osAndroid: true,
        osLinux: false,
        osMac: false,
        imagens: [
          { id: "1", urlImagem: "https://via.placeholder.com/400x300" },
          { id: "2", urlImagem: "https://via.placeholder.com/400x300" },
          { id: "3", urlImagem: "https://via.placeholder.com/400x300" },
          { id: "4", urlImagem: "https://via.placeholder.com/400x300" },
        ],
        favoritado: false,
      },
    ]

    const jogo = jogos.find(j => j.id === params.id)
    if (!jogo) {
      throw new Error("Jogo não encontrado")
    }

    return jogo
  },

  // Criar jogo
  criarJogo: async (dados: any) => {
    console.log("Criando jogo:", dados)
    return { id: "novo-id", ...dados }
  },

  // Atualizar jogo
  atualizarJogo: async (dados: any) => {
    console.log("Atualizando jogo:", dados)
    return dados
  },

  // Deletar jogo
  deletarJogo: async (params: { id: string }) => {
    console.log("Deletando jogo:", params.id)
    return { success: true }
  },

  // Obter status de admin
  obterStatusAdmin: async () => {
    return { ehAdmin: true }
  },

  // Definir usuário como admin
  definirUsuarioComoAdmin: async () => {
    return { success: true }
  },

  // Adicionar aos favoritos
  adicionarAosFavoritos: async (params: { idJogo: string }) => {
    console.log("Adicionando aos favoritos:", params.idJogo)
    return { success: true }
  },

  // Remover dos favoritos
  removerDosFavoritos: async (params: { idJogo: string }) => {
    console.log("Removendo dos favoritos:", params.idJogo)
    return { success: true }
  },

  // Enviar imagem do jogo
  enviarImagemJogo: async (params: { idJogo: string; base64: string; nomeArquivo: string }) => {
    console.log("Enviando imagem:", params)
    return { id: "nova-imagem", urlImagem: "https://via.placeholder.com/400x300" }
  },

  // Obter imagens do jogo
  obterImagensJogo: async (params: { idJogo: string }) => {
    return [
      { id: "1", urlImagem: "https://via.placeholder.com/400x300" },
      { id: "2", urlImagem: "https://via.placeholder.com/400x300" },
    ]
  },

  // Deletar imagem do jogo
  deletarImagemJogo: async (params: { id: string }) => {
    console.log("Deletando imagem:", params.id)
    return { success: true }
  },
}