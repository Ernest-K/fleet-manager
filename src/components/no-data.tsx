import { FileX2 } from "lucide-react";
import React from "react";

type NoDataProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
};

function NoData({ icon = <FileX2 className="h-10 w-10 text-muted-foreground" />, title, description }: NoDataProps) {
  return (
    <div className="text-center pt-6">
      {icon && <div className="inline-block p-6 bg-muted rounded-full mb-3">{icon}</div>}
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
    </div>
  );
}

export default NoData;
