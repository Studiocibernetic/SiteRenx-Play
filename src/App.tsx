import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar,
  Download,
  Settings,
  Heart,
  User,
  ArrowLeft,
  Moon,
  Sun,
  Home,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { clienteApi } from "~/client/api";
import { usarToast, usarAutenticacao, codificarArquivoComoBase64 } from "~/client/utils";
import {
  Botao,
  Cartao,
  ConteudoCartao,
  RodapeCartao,
  CabecalhoCartao,
  TituloCartao,
  Entrada,
  Rotulo,
  AreaTexto,
  Distintivo,
  MenuDropdown,
  ConteudoMenuDropdown,
  ItemMenuDropdown,
  GatilhoMenuDropdown,
} from "~/components/ui";

// Tipos
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

// Componente principal
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navegacao />
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/jogo/:id" element={<PaginaDetalhesJogo />} />
          <Route path="/admin" element={<PainelAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}