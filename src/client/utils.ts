import { useState } from "react"

// Hook para toast (simulado)
export function usarToast() {
  const [toast, setToast] = useState<any>(null)

  const mostrarToast = (config: any) => {
    setToast(config)
    setTimeout(() => setToast(null), 3000)
  }

  return { toast, mostrarToast }
}

// Hook para autenticação (simulado)
export function usarAutenticacao() {
  const [status, setStatus] = useState<"autenticado" | "naoAutenticado">("naoAutenticado")

  const entrar = () => {
    setStatus("autenticado")
  }

  const sair = () => {
    setStatus("naoAutenticado")
  }

  return {
    status,
    entrar,
    sair,
  }
}

// Função para codificar arquivo como Base64
export async function codificarArquivoComoBase64(arquivo: File): Promise<string | null> {
  return new Promise((resolve) => {
    const leitor = new FileReader()
    leitor.onload = () => {
      const resultado = leitor.result as string
      resolve(resultado)
    }
    leitor.onerror = () => resolve(null)
    leitor.readAsDataURL(arquivo)
  })
}