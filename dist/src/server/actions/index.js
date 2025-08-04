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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.popularBancoComExemplos = exports.deletarImagemJogo = exports.obterImagensJogo = exports.enviarImagemJogo = exports.removerDosFavoritos = exports.adicionarAosFavoritos = exports.definirUsuarioComoAdmin = exports.obterStatusAdmin = exports.deletarJogo = exports.atualizarJogo = exports.criarJogo = exports.obterJogo = exports.listarJogos = void 0;
var db_1 = require("../db");
var auth_1 = require("../auth");
// Gerenciamento de Jogos
function listarJogos(input) {
    return __awaiter(this, void 0, void 0, function () {
        var pagina, limite, offset, where, _a, jogos, total;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pagina = input.pagina || 1;
                    limite = input.limite || 12;
                    offset = (pagina - 1) * limite;
                    where = input.busca
                        ? {
                            OR: [
                                { titulo: { contains: input.busca } },
                                { descricao: { contains: input.busca } },
                                { tags: { contains: input.busca } },
                                { desenvolvedor: { contains: input.busca } },
                            ]
                        }
                        : {};
                    return [4 /*yield*/, Promise.all([
                            db_1.db.jogo.findMany({
                                where: where,
                                orderBy: { dataCriacao: "desc" },
                                skip: offset,
                                take: limite
                            }),
                            db_1.db.jogo.count({ where: where }),
                        ])];
                case 1:
                    _a = _b.sent(), jogos = _a[0], total = _a[1];
                    return [2 /*return*/, {
                            jogos: jogos,
                            paginacao: {
                                pagina: pagina,
                                limite: limite,
                                total: total,
                                totalPaginas: Math.ceil(total / limite)
                            }
                        }];
            }
        });
    });
}
exports.listarJogos = listarJogos;
function obterJogo(_a) {
    var id = _a.id;
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario, jogo, favoritado, favorito;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: false })];
                case 1:
                    auth = _b.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    return [4 /*yield*/, db_1.db.jogo.findUnique({
                            where: { id: id },
                            include: {
                                imagens: true
                            }
                        })];
                case 2:
                    jogo = _b.sent();
                    if (!jogo) {
                        throw new Error("Jogo não encontrado");
                    }
                    favoritado = false;
                    if (!idUsuario) return [3 /*break*/, 4];
                    return [4 /*yield*/, db_1.db.favorito.findUnique({
                            where: {
                                idJogo_idUsuario: {
                                    idJogo: id,
                                    idUsuario: idUsuario
                                }
                            }
                        })];
                case 3:
                    favorito = _b.sent();
                    favoritado = !!favorito;
                    _b.label = 4;
                case 4: return [2 /*return*/, __assign(__assign({}, jogo), { favoritado: favoritado })];
            }
        });
    });
}
exports.obterJogo = obterJogo;
function criarJogo(input) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario, usuario;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: true })];
                case 1:
                    auth = _a.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario)
                        throw new Error("Não autorizado");
                    return [4 /*yield*/, db_1.db.usuario.findUnique({ where: { id: idUsuario } })];
                case 2:
                    usuario = _a.sent();
                    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.ehAdmin)) {
                        throw new Error("Não autorizado: Acesso de admin necessário");
                    }
                    return [4 /*yield*/, db_1.db.jogo.create({
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
                                osMac: input.osMac || false
                            }
                        })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.criarJogo = criarJogo;
function atualizarJogo(input) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario, usuario, id, dadosAtualizacao;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: true })];
                case 1:
                    auth = _a.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario)
                        throw new Error("Não autorizado");
                    return [4 /*yield*/, db_1.db.usuario.findUnique({ where: { id: idUsuario } })];
                case 2:
                    usuario = _a.sent();
                    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.ehAdmin)) {
                        throw new Error("Não autorizado: Acesso de admin necessário");
                    }
                    id = input.id, dadosAtualizacao = __rest(input, ["id"]);
                    return [4 /*yield*/, db_1.db.jogo.update({
                            where: { id: id },
                            data: dadosAtualizacao
                        })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.atualizarJogo = atualizarJogo;
function deletarJogo(_a) {
    var id = _a.id;
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario, usuario;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: true })];
                case 1:
                    auth = _b.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario)
                        throw new Error("Não autorizado");
                    return [4 /*yield*/, db_1.db.usuario.findUnique({ where: { id: idUsuario } })];
                case 2:
                    usuario = _b.sent();
                    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.ehAdmin)) {
                        throw new Error("Não autorizado: Acesso de admin necessário");
                    }
                    return [4 /*yield*/, db_1.db.jogo["delete"]({
                            where: { id: id }
                        })];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.deletarJogo = deletarJogo;
// Gerenciamento de Usuários
function obterStatusAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario, usuario;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: false })];
                case 1:
                    auth = _a.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario) {
                        return [2 /*return*/, { ehAdmin: false }];
                    }
                    return [4 /*yield*/, db_1.db.usuario.findUnique({
                            where: { id: idUsuario },
                            select: { ehAdmin: true }
                        })];
                case 2:
                    usuario = _a.sent();
                    return [2 /*return*/, { ehAdmin: (usuario === null || usuario === void 0 ? void 0 : usuario.ehAdmin) || false }];
            }
        });
    });
}
exports.obterStatusAdmin = obterStatusAdmin;
function definirUsuarioComoAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: true })];
                case 1:
                    auth = _a.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario)
                        throw new Error("Não autorizado");
                    return [4 /*yield*/, db_1.db.usuario.upsert({
                            where: { id: idUsuario },
                            update: { ehAdmin: true },
                            create: { id: idUsuario, ehAdmin: true }
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
exports.definirUsuarioComoAdmin = definirUsuarioComoAdmin;
// Favoritos
function adicionarAosFavoritos(_a) {
    var idJogo = _a.idJogo;
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: true })];
                case 1:
                    auth = _b.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario)
                        throw new Error("Não autorizado");
                    return [4 /*yield*/, db_1.db.favorito.create({
                            data: {
                                idJogo: idJogo,
                                idUsuario: idUsuario
                            }
                        })];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.adicionarAosFavoritos = adicionarAosFavoritos;
function removerDosFavoritos(_a) {
    var idJogo = _a.idJogo;
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: true })];
                case 1:
                    auth = _b.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario)
                        throw new Error("Não autorizado");
                    return [4 /*yield*/, db_1.db.favorito["delete"]({
                            where: {
                                idJogo_idUsuario: {
                                    idJogo: idJogo,
                                    idUsuario: idUsuario
                                }
                            }
                        })];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.removerDosFavoritos = removerDosFavoritos;
// Gerenciamento de Imagens
function enviarImagemJogo(input) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario, usuario, urlImagem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: true })];
                case 1:
                    auth = _a.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario)
                        throw new Error("Não autorizado");
                    return [4 /*yield*/, db_1.db.usuario.findUnique({ where: { id: idUsuario } })];
                case 2:
                    usuario = _a.sent();
                    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.ehAdmin)) {
                        throw new Error("Não autorizado: Acesso de admin necessário");
                    }
                    urlImagem = "https://via.placeholder.com/400x300?text=".concat(encodeURIComponent(input.nomeArquivo));
                    return [4 /*yield*/, db_1.db.imagemJogo.create({
                            data: {
                                idJogo: input.idJogo,
                                urlImagem: urlImagem
                            }
                        })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.enviarImagemJogo = enviarImagemJogo;
function obterImagensJogo(_a) {
    var idJogo = _a.idJogo;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db_1.db.imagemJogo.findMany({
                        where: { idJogo: idJogo },
                        orderBy: { id: "desc" }
                    })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.obterImagensJogo = obterImagensJogo;
function deletarImagemJogo(_a) {
    var id = _a.id;
    return __awaiter(this, void 0, void 0, function () {
        var auth, idUsuario, usuario;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, auth_1.obterAutenticacao)({ obrigatorio: true })];
                case 1:
                    auth = _b.sent();
                    idUsuario = auth === null || auth === void 0 ? void 0 : auth.idUsuario;
                    if (!idUsuario)
                        throw new Error("Não autorizado");
                    return [4 /*yield*/, db_1.db.usuario.findUnique({ where: { id: idUsuario } })];
                case 2:
                    usuario = _b.sent();
                    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.ehAdmin)) {
                        throw new Error("Não autorizado: Acesso de admin necessário");
                    }
                    return [4 /*yield*/, db_1.db.imagemJogo["delete"]({
                            where: { id: id }
                        })];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.deletarImagemJogo = deletarImagemJogo;
// Função para popular o banco com dados de exemplo
function popularBancoComExemplos() {
    return __awaiter(this, void 0, void 0, function () {
        var jogosExemplo, _i, jogosExemplo_1, jogo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jogosExemplo = [
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
                            osMac: false
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
                            osMac: false
                        },
                    ];
                    _i = 0, jogosExemplo_1 = jogosExemplo;
                    _a.label = 1;
                case 1:
                    if (!(_i < jogosExemplo_1.length)) return [3 /*break*/, 4];
                    jogo = jogosExemplo_1[_i];
                    return [4 /*yield*/, db_1.db.jogo.create({
                            data: jogo
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Banco populado com dados de exemplo!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.popularBancoComExemplos = popularBancoComExemplos;
