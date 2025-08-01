"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "~/components/App";

const queryClient = new QueryClient();

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}