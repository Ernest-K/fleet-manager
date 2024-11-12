import { Navbar } from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navbar>
        <h1 className="font-semibold text-lg">Fleet Manager</h1>
        <ThemeToggle />
      </Navbar>
      {children}
    </div>
  );
};
