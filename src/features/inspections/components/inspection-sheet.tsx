import React, { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import VehicleCard from "@/features/vehicles/components/vehicle-card";
import { Inspection } from "@/features/inspections/types";
import InspectionCard from "@/features/inspections/components/inspection-card";

type InspectionSheetProps = {
  trigger: ReactNode;
  inspection: Inspection;
};

function InspectionSheet({ trigger, inspection }: InspectionSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="min-w-full sm:min-w-max sm:max-w-lg overflow-y-scroll max-h-screen no-scrollbar">
        <SheetHeader>
          <SheetTitle>Inspection details</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <InspectionCard inspection={inspection} />
          {inspection.vehicle && <VehicleCard vehicle={inspection.vehicle} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default InspectionSheet;
