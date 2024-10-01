import React, { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import VehicleCard from "@/features/vehicles/components/vehicle-card";
import { Service } from "@/features/services/types";
import ServiceCard from "@/features/services/components/service-card";

type ServiceSheetProps = {
  trigger: ReactNode;
  service: Service;
};

function ServiceSheet({ trigger, service }: ServiceSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="min-w-full sm:min-w-max sm:max-w-lg overflow-y-scroll max-h-screen no-scrollbar">
        <SheetHeader>
          <SheetTitle>Service details</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <ServiceCard service={service} />
          {service.vehicle && <VehicleCard vehicle={service.vehicle} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ServiceSheet;
