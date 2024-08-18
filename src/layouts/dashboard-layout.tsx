import Navbar from "@/features/dashboard/components/navbar";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
      <div className={`min-h-screen`}>
      <Navbar />
        {children}
      </div>
  );
};
