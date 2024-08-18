import { ReactNode } from "react";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
};
