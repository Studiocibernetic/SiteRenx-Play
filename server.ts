import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { db } from "./src/server/db";
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
} from "./src/server/actions";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "dist")));

// API Routes
app.get("/api/jogos", async (req, res) => {
  try {
    const { pagina, limite, busca } = req.query;
    const resultado = await listarJogos({
      pagina: pagina ? parseInt(pagina as string) : undefined,
      limite: limite ? parseInt(limite as string) : undefined,
      busca: busca as string,
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/api/jogos/:id", async (req, res) => {
  try {
    const jogo = await obterJogo({ id: req.params.id });
    res.json(jogo);
  } catch (error) {
    res.status(404).json({ error: "Jogo não encontrado" });
  }
});

app.post("/api/jogos", async (req, res) => {
  try {
    const jogo = await criarJogo(req.body);
    res.status(201).json(jogo);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar jogo" });
  }
});

app.put("/api/jogos/:id", async (req, res) => {
  try {
    const jogo = await atualizarJogo({ id: req.params.id, ...req.body });
    res.json(jogo);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar jogo" });
  }
});

app.delete("/api/jogos/:id", async (req, res) => {
  try {
    await deletarJogo({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar jogo" });
  }
});

app.get("/api/admin/status", async (req, res) => {
  try {
    const status = await obterStatusAdmin();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar status admin" });
  }
});

app.post("/api/admin/definir", async (req, res) => {
  try {
    await definirUsuarioComoAdmin();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Erro ao definir admin" });
  }
});

app.post("/api/favoritos/adicionar", async (req, res) => {
  try {
    await adicionarAosFavoritos(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Erro ao adicionar favorito" });
  }
});

app.delete("/api/favoritos/remover", async (req, res) => {
  try {
    await removerDosFavoritos(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover favorito" });
  }
});

app.post("/api/imagens/enviar", async (req, res) => {
  try {
    const imagem = await enviarImagemJogo(req.body);
    res.json(imagem);
  } catch (error) {
    res.status(400).json({ error: "Erro ao enviar imagem" });
  }
});

app.get("/api/imagens/:idJogo", async (req, res) => {
  try {
    const imagens = await obterImagensJogo({ idJogo: req.params.idJogo });
    res.json(imagens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter imagens" });
  }
});

app.delete("/api/imagens/:id", async (req, res) => {
  try {
    await deletarImagemJogo({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar imagem" });
  }
});

// Serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Socket.IO para chat em tempo real
io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  socket.on("enviar-mensagem", async (data) => {
    try {
      const mensagem = await db.mensagemChat.create({
        data: {
          conteudo: data.conteudo,
          urlImagem: data.urlImagem,
          ehConvidado: data.ehConvidado || false,
          nomeConvidado: data.nomeConvidado,
          idUsuario: data.idUsuario,
        },
      });

      io.emit("nova-mensagem", mensagem);
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Banco de dados: SQLite`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});