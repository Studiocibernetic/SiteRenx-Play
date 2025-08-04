import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Botao } from "~/components/ui";
import { clienteApi } from "~/client/api";
import { usarToast, codificarArquivoComoBase64 } from "~/client/utils";

export function GerenciadorImagens({
  idJogo,
  nomeJogo,
}: {
  idJogo: string;
  nomeJogo: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = usarToast();
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const { data: imagens } = useQuery(["imagensJogo", idJogo], () =>
    clienteApi.obterImagensJogo({ idJogo }),
  );

  const enviarImagemMutation = useMutation(clienteApi.enviarImagemJogo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["imagensJogo", idJogo]);
      setArquivoSelecionado(null);
      setEnviando(false);
      toast({ title: "Imagem enviada com sucesso" });
    },
    onError: (error: any) => {
      setEnviando(false);
      toast({
        title: "Erro ao enviar imagem",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletarImagemMutation = useMutation(clienteApi.deletarImagemJogo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["imagensJogo", idJogo]);
      toast({ title: "Imagem removida com sucesso" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover imagem",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoSelecionado(file);
    }
  };

  const handleUpload = async () => {
    if (!arquivoSelecionado) return;

    setEnviando(true);
    try {
      const base64 = await codificarArquivoComoBase64(arquivoSelecionado);
      if (!base64) {
        throw new Error("Erro ao processar arquivo");
      }

      enviarImagemMutation.mutate({
        idJogo,
        base64,
        nomeArquivo: arquivoSelecionado.name,
      });
    } catch {
      setEnviando(false);
      toast({
        title: "Erro ao processar arquivo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Galeria de Imagens - {nomeJogo}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Botao
          onClick={handleUpload}
          disabled={!arquivoSelecionado || enviando}
          size="sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          {enviando ? "Enviando..." : "Enviar"}
        </Botao>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imagens?.map((imagem) => (
          <div key={imagem.id} className="relative group">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
              <img
                src={imagem.urlImagem}
                alt="Screenshot do jogo"
                className="w-full h-full object-cover"
              />
            </div>
            <Botao
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                if (confirm("Tem certeza que deseja remover esta imagem?")) {
                  deletarImagemMutation.mutate({ id: imagem.id });
                }
              }}
            >
              <X className="h-3 w-3" />
            </Botao>
          </div>
        ))}
      </div>

      {imagens?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nenhuma imagem adicionada ainda</p>
        </div>
      )}
    </div>
  );
}