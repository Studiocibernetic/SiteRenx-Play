import { useState, useEffect } from "react";

// Toast hook
export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = ({ title, description, variant = "default" }: any) => {
    const id = Date.now();
    const newToast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toast, toasts };
}

// Auth hook
export function useAuth() {
  const [status, setStatus] = useState<"authenticated" | "unauthenticated">("authenticated");
  
  const signIn = () => {
    setStatus("authenticated");
  };
  
  const signOut = () => {
    setStatus("unauthenticated");
  };

  return { status, signIn, signOut };
}

// File encoding utility
export function encodeFileAsBase64DataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}