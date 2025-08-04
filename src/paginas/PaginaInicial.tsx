import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Entrada } from "~/components/ui";
import { clienteApi } from "~/client/api";
import { CartaoJogo, Paginacao } from "~/componentes";

export function PaginaInicial() {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [busca, setBusca] = useState("");
  const [buscaDebounced, setBuscaDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscaDebounced(busca);
      setPaginaAtual(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [busca]);

  const { data: dadosJogos, isLoading } = useQuery(
    ["jogos", paginaAtual, buscaDebounced],
    () =>
      clienteApi.listarJogos({
        pagina: paginaAtual,
        limite: 12,
        busca: buscaDebounced,
      }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Entrada
            type="search"
            placeholder="Buscar jogos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded-lg"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dadosJogos?.jogos.map((jogo) => (
              <CartaoJogo key={jogo.id} jogo={jogo} />
            ))}
          </div>

          {dadosJogos?.jogos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum jogo encontrado.</p>
            </div>
          )}

          {dadosJogos?.paginacao && (
            <Paginacao
              paginaAtual={dadosJogos.paginacao.pagina}
              totalPaginas={dadosJogos.paginacao.totalPaginas}
              aoMudarPagina={setPaginaAtual}
            />
          )}
        </>
      )}
    </div>
  );
}