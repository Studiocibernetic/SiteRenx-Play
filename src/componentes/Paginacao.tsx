
import React from "react";
import { Botao } from "~/components/ui";

export function Paginacao({
  paginaAtual,
  totalPaginas,
  aoMudarPagina,
}: {
  paginaAtual: number;
  totalPaginas: number;
  aoMudarPagina: (pagina: number) => void;
}) {
  if (totalPaginas <= 1) return null;

  const obterPaginasVisiveis = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeComPontos: (number | string)[] = [];

    for (
      let i = Math.max(2, paginaAtual - delta);
      i <= Math.min(totalPaginas - 1, paginaAtual + delta);
      i++
    ) {
      range.push(i);
    }

    if (paginaAtual - delta > 2) {
      rangeComPontos.push(1, "...");
    } else {
      rangeComPontos.push(1);
    }

    rangeComPontos.push(...range);

    if (paginaAtual + delta < totalPaginas - 1) {
      rangeComPontos.push("...", totalPaginas);
    } else {
      rangeComPontos.push(totalPaginas);
    }

    return rangeComPontos;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Botao
        variant="outline"
        size="sm"
        onClick={() => aoMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
      >
        Anterior
      </Botao>

      {obterPaginasVisiveis().map((pagina, index) => (
        <React.Fragment key={index}>
          {pagina === "..." ? (
            <span className="px-2">...</span>
          ) : (
            <Botao
              variant={paginaAtual === pagina ? "default" : "outline"}
              size="sm"
              onClick={() => aoMudarPagina(pagina as number)}
            >
              {pagina}
            </Botao>
          )}
        </React.Fragment>
      ))}

      <Botao
        variant="outline"
        size="sm"
        onClick={() => aoMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
      >
        Próximo
      </Botao>
    </div>
  );
}