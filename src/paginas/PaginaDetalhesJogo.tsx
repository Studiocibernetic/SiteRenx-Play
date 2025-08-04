import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Star,
  Download,
  Heart,
  ArrowLeft,
} from "lucide-react";
import {
  Botao,
  Cartao,
  CabecalhoCartao,
  TituloCartao,
  ConteudoCartao,
  Distintivo,
} from "~/components/ui";
import { clienteApi } from "~/client/api";
import { usarToast, usarAutenticacao } from "~/client/utils";

export function PaginaDetalhesJogo() {
  const { id } = useParams<{ id: string }>();
  const { toast } = usarToast();
  const auth = usarAutenticacao();
  const queryClient = useQueryClient();
  const [plataformaSelecionada, setPlataformaSelecionada] = useState<string>("");

  const { data: jogo, isLoading: carregandoJogo } = useQuery(
    ["jogo", id],
    () => clienteApi.obterJogo({ id: id! }),
    { enabled: !!id },
  );

  const adicionarFavoritosMutation = useMutation(clienteApi.adicionarAosFavoritos, {
    onSuccess: () => {
      queryClient.invalidateQueries(["jogo", id]);
      toast({ title: "Adicionado aos favoritos" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar aos favoritos",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removerFavoritosMutation = useMutation(
    clienteApi.removerDosFavoritos,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["jogo", id]);
        toast({ title: "Removido dos favoritos" });
      },
      onError: (error: any) => {
        toast({
          title: "Erro ao remover dos favoritos",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );

  if (carregandoJogo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!jogo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Jogo não encontrado</h1>
          <Link to="/">
            <Botao variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a lista
            </Botao>
          </Link>
        </div>
      </div>
    );
  }

  const tags = jogo.tags.split(",").map((tag: string) => tag.trim());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/">
          <Botao variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a lista
          </Botao>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="aspect-[3/2] overflow-hidden rounded-lg shadow-lg">
          <img
            src={jogo.urlImagem}
            alt={jogo.titulo}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => window.open(jogo.urlImagem, "_blank")}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{jogo.titulo}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Distintivo variant="secondary">{jogo.engine}</Distintivo>
              <span>{jogo.versao}</span>
              <span>•</span>
              <span>{jogo.desenvolvedor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-medium">
                {jogo.avaliacao.toFixed(1)}
              </span>
            </div>

            {auth.status === "autenticado" && (
              <Botao
                variant={jogo.favoritado ? "default" : "outline"}
                onClick={() => {
                  if (jogo.favoritado) {
                    removerFavoritosMutation.mutate({ idJogo: id! });
                  } else {
                    adicionarFavoritosMutation.mutate({ idJogo: id! });
                  }
                }}
                disabled={
                  adicionarFavoritosMutation.isLoading ||
                  removerFavoritosMutation.isLoading
                }
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${jogo.favoritado ? "fill-current" : ""}`}
                />
                {jogo.favoritado
                  ? "Remover dos Favoritos"
                  : "Adicionar aos Favoritos"}
              </Botao>
            )}
          </div>

          <p className="text-muted-foreground mb-4">{jogo.descricao}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Idioma:</strong> {jogo.idioma}
            </div>
            <div>
              <strong>Censurado:</strong> {jogo.censurado ? "Sim" : "Não"}
            </div>
            <div>
              <strong>Lançamento:</strong>{" "}
              {new Date(jogo.dataLancamento).toLocaleDateString()}
            </div>
          </div>

          <div className="mb-4">
            <strong className="text-sm">Plataformas:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {jogo.osWindows && <Distintivo variant="outline">Windows</Distintivo>}
              {jogo.osAndroid && <Distintivo variant="outline">Android</Distintivo>}
              {jogo.osLinux && <Distintivo variant="outline">Linux</Distintivo>}
              {jogo.osMac && <Distintivo variant="outline">Mac</Distintivo>}
            </div>
          </div>

          {/* Seleção de Plataforma para Download */}
          <div className="mb-4">
            <strong className="text-sm">Selecionar Plataforma:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {jogo.osWindows && jogo.urlDownloadWindows && (
                <Botao
                  variant={
                    plataformaSelecionada === "windows" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setPlataformaSelecionada("windows")}
                >
                  🪟 Windows
                </Botao>
              )}
              {jogo.osAndroid && jogo.urlDownloadAndroid && (
                <Botao
                  variant={
                    plataformaSelecionada === "android" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setPlataformaSelecionada("android")}
                >
                  🤖 Android
                </Botao>
              )}
              {jogo.osLinux && jogo.urlDownloadLinux && (
                <Botao
                  variant={plataformaSelecionada === "linux" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPlataformaSelecionada("linux")}
                >
                  🐧 Linux
                </Botao>
              )}
              {jogo.osMac && jogo.urlDownloadMac && (
                <Botao
                  variant={plataformaSelecionada === "mac" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPlataformaSelecionada("mac")}
                >
                  🍎 Mac
                </Botao>
              )}
            </div>
          </div>

          <div className="mb-4">
            <strong className="text-sm">Tags:</strong>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag: string, index: number) => (
                <span key={index} className="etiqueta-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {(() => {
            let urlDownload = "";
            let nomePlataforma = "";

            if (plataformaSelecionada === "windows" && jogo.urlDownloadWindows) {
              urlDownload = jogo.urlDownloadWindows;
              nomePlataforma = "Windows";
            } else if (
              plataformaSelecionada === "android" &&
              jogo.urlDownloadAndroid
            ) {
              urlDownload = jogo.urlDownloadAndroid;
              nomePlataforma = "Android";
            } else if (plataformaSelecionada === "linux" && jogo.urlDownloadLinux) {
              urlDownload = jogo.urlDownloadLinux;
              nomePlataforma = "Linux";
            } else if (plataformaSelecionada === "mac" && jogo.urlDownloadMac) {
              urlDownload = jogo.urlDownloadMac;
              nomePlataforma = "Mac";
            } else if (jogo.urlDownload) {
              urlDownload = jogo.urlDownload;
              nomePlataforma = "Jogo";
            }

            return urlDownload ? (
              <Botao asChild className="w-full">
                <a href={urlDownload} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar {nomePlataforma}
                </a>
              </Botao>
            ) : (
              <Botao disabled className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Selecione uma plataforma
              </Botao>
            );
          })()}

          {/* Galeria de Imagens */}
          {jogo.imagens && jogo.imagens.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {jogo.imagens.map((imagem, index) => (
                  <div key={imagem.id} className="group relative">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md border border-border bg-muted">
                      <img
                        src={imagem.urlImagem}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => window.open(imagem.urlImagem, "_blank")}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {jogo.notasDev && (
        <Cartao className="mb-8">
          <CabecalhoCartao>
            <TituloCartao className="text-lg">Notas do Desenvolvedor</TituloCartao>
          </CabecalhoCartao>
          <ConteudoCartao>
            <p className="text-sm whitespace-pre-wrap">{jogo.notasDev}</p>
          </ConteudoCartao>
        </Cartao>
      )}
    </div>
  );
}