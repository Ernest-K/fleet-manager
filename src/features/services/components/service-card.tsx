import React from "react";
import DetailRow from "@/components/detail-row";
import { Bolt, CalendarIcon, CircleDot, FileWarning, Notebook, Pencil, UserRound } from "lucide-react";
import { format } from "date-fns";
import { Service } from "@/features/services/types";
import { Button } from "@/components/ui/button";
import ServiceDialog from "@/features/services/components/service-dialog";

type ServiceCardProps = {
  service: Service;
};

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="border-border border-[1px] rounded-lg p-6 flex flex-col justify-center gap-3 relative grow">
      <ServiceDialog
        service={service}
        trigger={
          <Button variant="ghost" size="icon" className="absolute top-6 right-6">
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <div className="flex flex-col justify-evenly gap-3">
        {service.createdByUser && (
          <div className="flex flex-col sm:flex-row gap-3 ">
            <DetailRow Icon={UserRound} label="Role" value={service.createdByUser.role} />
            <div className="flex gap-3 ml-10 sm:ml-0">
              <DetailRow label="First name" value={service.createdByUser.firstName} />
              <DetailRow label="Last name" value={service.createdByUser.lastName} />
            </div>
          </div>
        )}
        <DetailRow Icon={FileWarning} label="Issue type" value={service.type} />
        <DetailRow Icon={CircleDot} label="Status" value={service.status} />
        <DetailRow Icon={CalendarIcon} label="Service date" value={format(service.date.toDate(), "PPP")} />
        <div className="flex gap-6 items-top">
          <Bolt className="w-4 h-4 md:w-6 md:h-6 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground capitalize">Parts:</p>
            {service.parts && service.parts.length ? (
              service.parts.map((part, index) => (
                <p key={index} className="md:text-lg">
                  {part.name} <span className="text-xs">x</span>
                  {part.quantity}
                </p>
              ))
            ) : (
              <p className="md:text-lg">n/a</p>
            )}
          </div>
        </div>
        <DetailRow Icon={Notebook} label="Notes" value={service.notes} />
      </div>
    </div>
  );
}

export default ServiceCard;
