"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var path = require("path");
var db_1 = require("./src/server/db");
var actions_1 = require("./src/server/actions");
var app = express();
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "dist")));
// API Routes
app.get("/api/jogos", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, pagina, limite, busca, resultado, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, pagina = _a.pagina, limite = _a.limite, busca = _a.busca;
                return [4 /*yield*/, (0, actions_1.listarJogos)({
                        pagina: pagina ? parseInt(pagina) : undefined,
                        limite: limite ? parseInt(limite) : undefined,
                        busca: busca
                    })];
            case 1:
                resultado = _b.sent();
                res.json(resultado);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json({ error: "Erro interno do servidor" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/api/jogos/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jogo, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.obterJogo)({ id: req.params.id })];
            case 1:
                jogo = _a.sent();
                res.json(jogo);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(404).json({ error: "Jogo não encontrado" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/jogos", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jogo, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.criarJogo)(req.body)];
            case 1:
                jogo = _a.sent();
                res.status(201).json(jogo);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(400).json({ error: "Erro ao criar jogo" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put("/api/jogos/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jogo, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.atualizarJogo)(__assign({ id: req.params.id }, req.body))];
            case 1:
                jogo = _a.sent();
                res.json(jogo);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(400).json({ error: "Erro ao atualizar jogo" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app["delete"]("/api/jogos/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.deletarJogo)({ id: req.params.id })];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(400).json({ error: "Erro ao deletar jogo" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/api/admin/status", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.obterStatusAdmin)()];
            case 1:
                status_1 = _a.sent();
                res.json(status_1);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(500).json({ error: "Erro ao verificar status admin" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/admin/definir", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.definirUsuarioComoAdmin)()];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(400).json({ error: "Erro ao definir admin" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/favoritos/adicionar", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.adicionarAosFavoritos)(req.body)];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                res.status(400).json({ error: "Erro ao adicionar favorito" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app["delete"]("/api/favoritos/remover", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.removerDosFavoritos)(req.body)];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                res.status(400).json({ error: "Erro ao remover favorito" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/api/imagens/enviar", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var imagem, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.enviarImagemJogo)(req.body)];
            case 1:
                imagem = _a.sent();
                res.json(imagem);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                res.status(400).json({ error: "Erro ao enviar imagem" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/api/imagens/:idJogo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var imagens, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.obterImagensJogo)({ idJogo: req.params.idJogo })];
            case 1:
                imagens = _a.sent();
                res.json(imagens);
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                res.status(500).json({ error: "Erro ao obter imagens" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app["delete"]("/api/imagens/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, actions_1.deletarImagemJogo)({ id: req.params.id })];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                res.status(400).json({ error: "Erro ao deletar imagem" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Serve React app
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});
// Socket.IO para chat em tempo real
io.on("connection", function (socket) {
    console.log("Usuário conectado:", socket.id);
    socket.on("enviar-mensagem", function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var mensagem, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.db.mensagemChat.create({
                            data: {
                                conteudo: data.conteudo,
                                urlImagem: data.urlImagem,
                                ehConvidado: data.ehConvidado || false,
                                nomeConvidado: data.nomeConvidado,
                                idUsuario: data.idUsuario
                            }
                        })];
                case 1:
                    mensagem = _a.sent();
                    io.emit("nova-mensagem", mensagem);
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    console.error("Erro ao salvar mensagem:", error_13);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    socket.on("disconnect", function () {
        console.log("Usuário desconectado:", socket.id);
    });
});
var PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log("\uD83D\uDE80 Servidor rodando na porta ".concat(PORT));
    console.log("\uD83D\uDCCA Banco de dados: SQLite");
    console.log("\uD83C\uDF10 Acesse: http://localhost:".concat(PORT));
    console.log("\uD83D\uDD27 API: http://localhost:".concat(PORT, "/api"));
});
