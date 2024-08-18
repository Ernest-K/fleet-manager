import React, { ReactNode } from "react";

interface NavbarProps {
  children: ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  return (
    <nav className="border-b border-border">
      <div className="container mx-auto min-h-16 flex justify-between items-center">{children}</div>
    </nav>
  );
}
