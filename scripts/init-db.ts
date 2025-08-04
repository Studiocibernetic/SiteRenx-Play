import { PrismaClient } from "@prisma/client";
import { popularBancoComExemplos } from "../src/server/actions";

const prisma = new PrismaClient();

async function main() {
  console.log("Inicializando banco de dados...");
  
  // Criar usuário admin padrão
  await prisma.usuario.upsert({
    where: { id: "usuario-teste-123" },
    update: { ehAdmin: true },
    create: { 
      id: "usuario-teste-123",
      nome: "Administrador",
      ehAdmin: true,
    },
  });

  console.log("Usuário admin criado!");

  // Popular com dados de exemplo
  await popularBancoComExemplos();

  console.log("Banco de dados inicializado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });