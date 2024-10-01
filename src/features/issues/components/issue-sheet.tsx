import React, { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import VehicleCard from "@/features/vehicles/components/vehicle-card";
import { Issue } from "../types";
import IssueCard from "./issue-card";

type IssueSheetProps = {
  trigger: ReactNode;
  issue: Issue;
};

function IssueSheet({ trigger, issue }: IssueSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="min-w-full sm:min-w-max sm:max-w-lg overflow-y-scroll max-h-screen no-scrollbar">
        <SheetHeader>
          <SheetTitle>Issue details</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <IssueCard issue={issue} />
          {issue.vehicle && <VehicleCard vehicle={issue.vehicle} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default IssueSheet;
