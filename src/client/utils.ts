import { useToast as useToastHook } from "~/components/ui/toast";

// Re-export toast hook
export const useToast = useToastHook;

// Mock auth system for demo purposes
export function useAuth() {
  return {
    status: "authenticated" as "authenticated" | "unauthenticated",
    signIn: () => {
      console.log("Mock sign in");
    },
    signOut: () => {
      console.log("Mock sign out");
    },
  };
}

// File encoding utility
export async function encodeFileAsBase64DataURL(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => {
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
}