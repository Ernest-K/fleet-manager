import { ReactNode } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type AppProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export const AppProvider = ({ children }: AppProviderProps) => {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};
