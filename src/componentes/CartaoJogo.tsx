import React from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, Download } from "lucide-react";
import {
  Cartao,
  CabecalhoCartao,
  TituloCartao,
  ConteudoCartao,
  RodapeCartao,
  Botao,
  Distintivo,
} from "~/components/ui";

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

export function CartaoJogo({ jogo }: { jogo: Jogo }) {
  const tags = jogo.tags.split(",").map((tag: string) => tag.trim());

  return (
    <Link to={`/jogo/${jogo.id}`} className="block">
      <Cartao className="cartao-jogo overflow-hidden cursor-pointer">
        <div className="imagem-cartao-jogo">
          <img src={jogo.urlImagem} alt={jogo.titulo} loading="lazy" />
        </div>
        <CabecalhoCartao className="pb-2">
          <TituloCartao className="text-lg limite-linha-2">{jogo.titulo}</TituloCartao>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Distintivo variant="secondary">{jogo.engine}</Distintivo>
            <span>{jogo.versao}</span>
          </div>
        </CabecalhoCartao>
        <ConteudoCartao className="pb-2">
          <p className="text-sm text-muted-foreground limite-linha-3 mb-3">
            {jogo.descricao}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {jogo.avaliacao.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className="etiqueta-badge">
                {tag}
              </span>
            ))}
          </div>
        </ConteudoCartao>
        <RodapeCartao className="pt-2">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(jogo.dataLancamento).toLocaleDateString()}</span>
            </div>
            {(jogo.urlDownload ||
              jogo.urlDownloadWindows ||
              jogo.urlDownloadAndroid ||
              jogo.urlDownloadLinux ||
              jogo.urlDownloadMac) && (
              <Botao
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  const urlDownload =
                    jogo.urlDownloadWindows ||
                    jogo.urlDownloadAndroid ||
                    jogo.urlDownloadLinux ||
                    jogo.urlDownloadMac ||
                    jogo.urlDownload;
                  if (urlDownload) {
                    window.open(urlDownload, "_blank");
                  }
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Botao>
            )}
          </div>
        </RodapeCartao>
      </Cartao>
    </Link>
  );
}