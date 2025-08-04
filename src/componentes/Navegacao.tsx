import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Settings,
  User,
  ChevronDown,
  Moon,
  Sun,
  Home,
} from "lucide-react";
import {
  Botao,
  MenuDropdown,
  ConteudoMenuDropdown,
  ItemMenuDropdown,
  GatilhoMenuDropdown,
} from "~/components/ui";
import { clienteApi } from "~/client/api";
import { usarAutenticacao } from "~/client/utils";

export function Navegacao() {
  const auth = usarAutenticacao();
  const { data: statusAdmin } = useQuery(
    ["statusAdmin"],
    clienteApi.obterStatusAdmin,
  );
  const [ehEscuro, setEhEscuro] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema");
    const sistemaPrefereEscuro = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const deveUsarEscuro =
      temaSalvo === "dark" || (!temaSalvo && sistemaPrefereEscuro);

    setEhEscuro(deveUsarEscuro);

    if (deveUsarEscuro) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const alternarTema = () => {
    const novoTema = !ehEscuro;
    setEhEscuro(novoTema);

    if (novoTema) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema", "light");
    }
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Renx-Play
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Botao variant="ghost">
                <Home className="h-4 w-4 mr-2" />
                Games
              </Botao>
            </Link>
            {statusAdmin?.ehAdmin && (
              <Link to="/admin">
                <Botao variant="ghost">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Botao>
              </Link>
            )}

            <MenuDropdown>
              <GatilhoMenuDropdown asChild>
                <Botao variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Botao>
              </GatilhoMenuDropdown>
              <ConteudoMenuDropdown align="end">
                <ItemMenuDropdown onClick={alternarTema}>
                  {ehEscuro ? (
                    <Sun className="h-4 w-4 mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 mr-2" />
                  )}
                  {ehEscuro ? "Tema Claro" : "Tema Escuro"}
                </ItemMenuDropdown>
              </ConteudoMenuDropdown>
            </MenuDropdown>

            {auth.status === "naoAutenticado" && (
              <Botao onClick={() => auth.entrar()} variant="outline">
                Login
              </Botao>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}