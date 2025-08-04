// Cliente da API real
import {
  listarJogos,
  obterJogo,
  criarJogo,
  atualizarJogo,
  deletarJogo,
  obterStatusAdmin,
  definirUsuarioComoAdmin,
  adicionarAosFavoritos,
  removerDosFavoritos,
  enviarImagemJogo,
  obterImagensJogo,
  deletarImagemJogo,
} from "~/server/actions";

export const clienteApi = {
  // Listar jogos
  listarJogos: async (params: { pagina?: number; limite?: number; busca?: string }) => {
    return await listarJogos(params);
  },

  // Obter jogo específico
  obterJogo: async (params: { id: string }) => {
    return await obterJogo(params);
  },

  // Criar jogo
  criarJogo: async (dados: any) => {
    return await criarJogo(dados);
  },

  // Atualizar jogo
  atualizarJogo: async (dados: any) => {
    return await atualizarJogo(dados);
  },

  // Deletar jogo
  deletarJogo: async (params: { id: string }) => {
    return await deletarJogo(params);
  },

  // Obter status de admin
  obterStatusAdmin: async () => {
    return await obterStatusAdmin();
  },

  // Definir usuário como admin
  definirUsuarioComoAdmin: async () => {
    return await definirUsuarioComoAdmin();
  },

  // Adicionar aos favoritos
  adicionarAosFavoritos: async (params: { idJogo: string }) => {
    return await adicionarAosFavoritos(params);
  },

  // Remover dos favoritos
  removerDosFavoritos: async (params: { idJogo: string }) => {
    return await removerDosFavoritos(params);
  },

  // Enviar imagem do jogo
  enviarImagemJogo: async (params: { idJogo: string; base64: string; nomeArquivo: string }) => {
    return await enviarImagemJogo(params);
  },

  // Obter imagens do jogo
  obterImagensJogo: async ({ idJogo }: { idJogo: string }) => {
    return await obterImagensJogo({ idJogo });
  },

  // Deletar imagem do jogo
  deletarImagemJogo: async (params: { id: string }) => {
    return await deletarImagemJogo(params);
  },
};