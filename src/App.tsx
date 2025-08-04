
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navegacao } from "~/componentes";
import { PaginaInicial, PaginaDetalhesJogo, PainelAdmin } from "~/paginas";

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