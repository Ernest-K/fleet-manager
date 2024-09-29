import { Driver } from "@/features/drivers/types";
import { Vehicle } from "@/features/vehicles/types";
import React, { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import DriverCard from "@/features/drivers/components/driver-card";
import VehicleCard from "@/features/vehicles/components/vehicle-card";

type AssignmentSheetProps = {
  trigger: ReactNode;
  driver?: Driver;
  vehicle?: Vehicle;
};

function AssignmentSheet({ trigger, driver, vehicle }: AssignmentSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="min-w-full sm:min-w-min overflow-y-scroll max-h-screen no-scrollbar">
        <SheetHeader>
          <SheetTitle>Assignment details</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {driver && <DriverCard driver={driver} />}
          {vehicle && <VehicleCard vehicle={vehicle} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AssignmentSheet;
