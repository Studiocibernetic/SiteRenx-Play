import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import {
  Botao,
  Cartao,
  CabecalhoCartao,
  TituloCartao,
  ConteudoCartao,
  RodapeCartao,
} from "~/components/ui";
import { clienteApi } from "~/client/api";
import { usarToast } from "~/client/utils";
import { FormularioJogo, GerenciadorImagens } from "~/componentes";

type Jogo = {
  id: string;
  titulo: string;
  descricao: string;
  urlImagem: string;
  desenvolvedor: string;
  versao: string;
  engine: string;
  idioma: string;
  avaliacao: number;
  tags: string;
  urlDownload?: string | null;
  urlDownloadWindows?: string | null;
  urlDownloadAndroid?: string | null;
  urlDownloadLinux?: string | null;
  urlDownloadMac?: string | null;
  censurado: boolean;
  instalacao: string;
  changelog: string;
  notasDev?: string | null;
  dataLancamento: string | Date;
  osWindows: boolean;
  osAndroid: boolean;
  osLinux: boolean;
  osMac: boolean;
  imagens?: Array<{ id: string; urlImagem: string }>;
  favoritado?: boolean;
};

export function PainelAdmin() {
  const queryClient = useQueryClient();
  const { toast } = usarToast();
  const [editandoJogo, setEditandoJogo] = useState<Jogo | null>(null);
  const [mostrarFormularioCriar, setMostrarFormularioCriar] = useState(false);
  const [gerenciandoImagensPara, setGerenciandoImagensPara] = useState<Jogo | null>(null);
  const navigate = useNavigate();

  const { data: statusAdmin } = useQuery(
    ["statusAdmin"],
    clienteApi.obterStatusAdmin,
  );

  const { data: dadosJogos } = useQuery(["jogos", 1, ""], () =>
    clienteApi.listarJogos({ pagina: 1, limite: 50 }),
  );

  const criarJogoMutation = useMutation(clienteApi.criarJogo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["jogos"]);
      setMostrarFormularioCriar(false);
      toast({ title: "Jogo criado com sucesso" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar jogo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const atualizarJogoMutation = useMutation(clienteApi.atualizarJogo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["jogos"]);
      setEditandoJogo(null);
      toast({ title: "Jogo atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar jogo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletarJogoMutation = useMutation(clienteApi.deletarJogo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["jogos"]);
      toast({ title: "Jogo deletado com sucesso" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao deletar jogo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const definirAdminMutation = useMutation(clienteApi.definirUsuarioComoAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries(["statusAdmin"]);
      toast({ title: "Acesso de admin concedido" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao definir admin",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  React.useEffect(() => {
    if (statusAdmin && !statusAdmin.ehAdmin) {
      navigate("/");
    }
  }, [statusAdmin, navigate]);

  if (!statusAdmin?.ehAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Cartao className="max-w-md mx-auto">
          <CabecalhoCartao>
            <TituloCartao>Acesso de Admin Necessário</TituloCartao>
          </CabecalhoCartao>
          <ConteudoCartao>
            <p className="mb-4">Você precisa de acesso de admin para ver esta página.</p>
            <Botao onClick={() => definirAdminMutation.mutate()}>
              Conceder Acesso de Admin
            </Botao>
          </ConteudoCartao>
        </Cartao>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
        <Botao onClick={() => setMostrarFormularioCriar(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Jogo
        </Botao>
      </div>

      {mostrarFormularioCriar && (
        <Cartao className="mb-8">
          <CabecalhoCartao>
            <TituloCartao>Criar Novo Jogo</TituloCartao>
          </CabecalhoCartao>
          <ConteudoCartao>
            <FormularioJogo
              aoEnviar={(dados) => criarJogoMutation.mutate(dados)}
              aoCancelar={() => setMostrarFormularioCriar(false)}
            />
          </ConteudoCartao>
        </Cartao>
      )}

      {editandoJogo && (
        <Cartao className="mb-8">
          <CabecalhoCartao>
            <TituloCartao>Editar Jogo</TituloCartao>
          </CabecalhoCartao>
          <ConteudoCartao>
            <FormularioJogo
              jogo={editandoJogo}
              aoEnviar={(dados) =>
                atualizarJogoMutation.mutate({ id: editandoJogo.id, ...dados })
              }
              aoCancelar={() => setEditandoJogo(null)}
            />
          </ConteudoCartao>
        </Cartao>
      )}

      {gerenciandoImagensPara && (
        <Cartao className="mb-8">
          <CabecalhoCartao>
            <TituloCartao>Gerenciar Imagens</TituloCartao>
          </CabecalhoCartao>
          <ConteudoCartao>
            <div className="mb-4">
              <Botao
                variant="outline"
                onClick={() => setGerenciandoImagensPara(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Botao>
            </div>
            <GerenciadorImagens
              idJogo={gerenciandoImagensPara.id}
              nomeJogo={gerenciandoImagensPara.titulo}
            />
          </ConteudoCartao>
        </Cartao>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dadosJogos?.jogos.map((jogo) => (
          <Cartao key={jogo.id} className="overflow-hidden">
            <div className="imagem-cartao-admin">
              <img
                src={jogo.urlImagem}
                alt={jogo.titulo}
                onClick={() => window.open(jogo.urlImagem, "_blank")}
              />
            </div>
            <CabecalhoCartao className="pb-3">
              <TituloCartao className="text-lg limite-linha-1">
                {jogo.titulo}
              </TituloCartao>
            </CabecalhoCartao>
            <ConteudoCartao className="pb-3">
              <p className="text-sm text-muted-foreground limite-linha-2">
                {jogo.descricao}
              </p>
            </ConteudoCartao>
            <RodapeCartao className="flex gap-2 flex-wrap pt-3">
              <Botao
                size="sm"
                variant="outline"
                onClick={() => setEditandoJogo(jogo)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Botao>
              <Botao
                size="sm"
                variant="secondary"
                onClick={() => setGerenciandoImagensPara(jogo)}
              >
                <ImageIcon className="h-3 w-3 mr-1" />
                Imagens
              </Botao>
              <Botao
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm("Tem certeza que deseja deletar este jogo?")) {
                    deletarJogoMutation.mutate({ id: jogo.id });
                  }
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Deletar
              </Botao>
            </RodapeCartao>
          </Cartao>
        ))}
      </div>
    </div>
  );
}