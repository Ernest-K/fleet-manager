import React, { ReactNode } from "react";
import BackButton from "@/components/back-button";

type DashboardContentHeaderProps = {
  title: string;
  description?: string;
  includeBackButton?: boolean;
  children?: ReactNode;
};

function DashboardContentHeader({ title, description, includeBackButton = false, children }: DashboardContentHeaderProps) {
  return (
    <header className="w-full flex justify-between items-center gap-6 mb-3">
      <div className="flex items-center gap-6">
        {includeBackButton && <BackButton />}
        <div>
          <h2 className="text-2xl font-medium">{title}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </header>
  );
}

export default DashboardContentHeader;
