import { useState } from "react";
import {
  Entrada,
  Rotulo,
  AreaTexto,
  Botao,
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

export function FormularioJogo({
  jogo,
  aoEnviar,
  aoCancelar,
}: {
  jogo?: Jogo;
  aoEnviar: (dados: any) => void;
  aoCancelar: () => void;
}) {
  const [dadosFormulario, setDadosFormulario] = useState({
    titulo: jogo?.titulo || "",
    descricao: jogo?.descricao || "",
    urlImagem: jogo?.urlImagem || "",
    desenvolvedor: jogo?.desenvolvedor || "Unknown",
    censurado: jogo?.censurado || false,
    versao: jogo?.versao || "v1.0",
    engine: jogo?.engine || "REN'PY",
    idioma: jogo?.idioma || "English",
    osWindows: jogo?.osWindows !== undefined ? jogo.osWindows : true,
    osAndroid: jogo?.osAndroid || false,
    osLinux: jogo?.osLinux || false,
    osMac: jogo?.osMac || false,
    instalacao: jogo?.instalacao || "Extrair e executar",
    changelog: jogo?.changelog || "Lançamento inicial",
    notasDev: jogo?.notasDev || "",
    avaliacao: jogo?.avaliacao || 4.5,
    tags: jogo?.tags || "Adult,Visual Novel",
    urlDownload: jogo?.urlDownload || "",
    urlDownloadWindows: jogo?.urlDownloadWindows || "",
    urlDownloadAndroid: jogo?.urlDownloadAndroid || "",
    urlDownloadLinux: jogo?.urlDownloadLinux || "",
    urlDownloadMac: jogo?.urlDownloadMac || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aoEnviar(dadosFormulario);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Rotulo htmlFor="titulo">📌 Título</Rotulo>
          <Entrada
            id="titulo"
            value={dadosFormulario.titulo}
            onChange={(e) =>
              setDadosFormulario({ ...dadosFormulario, titulo: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Rotulo htmlFor="desenvolvedor">🛠️ Desenvolvedor</Rotulo>
          <Entrada
            id="desenvolvedor"
            value={dadosFormulario.desenvolvedor}
            onChange={(e) =>
              setDadosFormulario({ ...dadosFormulario, desenvolvedor: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <Rotulo htmlFor="descricao">🧠 Descrição</Rotulo>
        <AreaTexto
          id="descricao"
          value={dadosFormulario.descricao}
          onChange={(e) =>
            setDadosFormulario({ ...dadosFormulario, descricao: e.target.value })
          }
          required
          rows={4}
        />
      </div>

      <div>
        <Rotulo htmlFor="urlImagem">🖼️ Imagem URL</Rotulo>
        <Entrada
          id="urlImagem"
          value={dadosFormulario.urlImagem}
          onChange={(e) =>
            setDadosFormulario({ ...dadosFormulario, urlImagem: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Rotulo htmlFor="versao">💻 Versão</Rotulo>
          <Entrada
            id="versao"
            value={dadosFormulario.versao}
            onChange={(e) =>
              setDadosFormulario({ ...dadosFormulario, versao: e.target.value })
            }
          />
        </div>

        <div>
          <Rotulo htmlFor="engine">🧠 Engine</Rotulo>
          <select
            id="engine"
            value={dadosFormulario.engine}
            onChange={(e) =>
              setDadosFormulario({ ...dadosFormulario, engine: e.target.value })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="REN'PY">REN'PY</option>
            <option value="Unity">Unity</option>
            <option value="RPG Maker">RPG Maker</option>
            <option value="HTML">HTML</option>
            <option value="Flash">Flash</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <Rotulo htmlFor="idioma">🌐 Língua</Rotulo>
          <Entrada
            id="idioma"
            value={dadosFormulario.idioma}
            onChange={(e) =>
              setDadosFormulario({ ...dadosFormulario, idioma: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <Rotulo>💽 Sistemas Operacionais</Rotulo>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={dadosFormulario.osWindows}
              onChange={(e) =>
                setDadosFormulario({ ...dadosFormulario, osWindows: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <span>Windows</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={dadosFormulario.osAndroid}
              onChange={(e) =>
                setDadosFormulario({ ...dadosFormulario, osAndroid: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <span>Android</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={dadosFormulario.osLinux}
              onChange={(e) =>
                setDadosFormulario({ ...dadosFormulario, osLinux: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <span>Linux</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={dadosFormulario.osMac}
              onChange={(e) =>
                setDadosFormulario({ ...dadosFormulario, osMac: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <span>Mac</span>
          </label>
        </div>
      </div>

      <div>
        <Rotulo htmlFor="avaliacao">🌟 Nota (1-5)</Rotulo>
        <Entrada
          id="avaliacao"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={dadosFormulario.avaliacao.toString()}
          onChange={(e) => {
            const value = e.target.value;
            const numValue = parseFloat(value);
            if (
              value === "" ||
              (!isNaN(numValue) && numValue >= 1 && numValue <= 5)
            ) {
              setDadosFormulario({
                ...dadosFormulario,
                avaliacao: value === "" ? 1 : numValue,
              });
            }
          }}
        />
      </div>

      <div>
        <Rotulo>📥 Links de Download por Plataforma</Rotulo>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Rotulo htmlFor="urlDownloadWindows">🪟 Windows</Rotulo>
            <Entrada
              id="urlDownloadWindows"
              value={dadosFormulario.urlDownloadWindows}
              onChange={(e) =>
                setDadosFormulario({ ...dadosFormulario, urlDownloadWindows: e.target.value })
              }
              placeholder="Link para download Windows"
            />
          </div>
          <div>
            <Rotulo htmlFor="urlDownloadAndroid">🤖 Android</Rotulo>
            <Entrada
              id="urlDownloadAndroid"
              value={dadosFormulario.urlDownloadAndroid}
              onChange={(e) =>
                setDadosFormulario({ ...dadosFormulario, urlDownloadAndroid: e.target.value })
              }
              placeholder="Link para download Android"
            />
          </div>
          <div>
            <Rotulo htmlFor="urlDownloadLinux">🐧 Linux</Rotulo>
            <Entrada
              id="urlDownloadLinux"
              value={dadosFormulario.urlDownloadLinux}
              onChange={(e) =>
                setDadosFormulario({ ...dadosFormulario, urlDownloadLinux: e.target.value })
              }
              placeholder="Link para download Linux"
            />
          </div>
          <div>
            <Rotulo htmlFor="urlDownloadMac">🍎 Mac</Rotulo>
            <Entrada
              id="urlDownloadMac"
              value={dadosFormulario.urlDownloadMac}
              onChange={(e) =>
                setDadosFormulario({ ...dadosFormulario, urlDownloadMac: e.target.value })
              }
              placeholder="Link para download Mac"
            />
          </div>
        </div>
        <div className="mt-2">
          <Rotulo htmlFor="urlDownload">📥 Link Genérico (opcional)</Rotulo>
          <Entrada
            id="urlDownload"
            value={dadosFormulario.urlDownload}
            onChange={(e) =>
              setDadosFormulario({ ...dadosFormulario, urlDownload: e.target.value })
            }
            placeholder="Link genérico de download"
          />
        </div>
      </div>

      <div>
        <Rotulo htmlFor="tags">🏷️ Tags (separadas por vírgula)</Rotulo>
        <Entrada
          id="tags"
          value={dadosFormulario.tags}
          onChange={(e) => setDadosFormulario({ ...dadosFormulario, tags: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Botao type="submit">{jogo ? "Atualizar Jogo" : "Criar Jogo"}</Botao>
        <Botao type="button" variant="outline" onClick={aoCancelar}>
          Cancelar
        </Botao>
      </div>
    </form>
  );
}