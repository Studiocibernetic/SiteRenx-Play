import { db } from "../db";
import { obterAutenticacaoReal, verificarAdminReal } from "./real";

export async function obterAutenticacao(params: { obrigatorio?: boolean } = {}) {
  return await obterAutenticacaoReal(params);
}

export async function verificarAdmin(idUsuario: string) {
  return await verificarAdminReal(idUsuario);
}