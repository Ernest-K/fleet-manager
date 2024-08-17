import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className={`${inter.variable} font-sans min-h-screen flex justify-center items-center`}>{children}</main>
  );
};
