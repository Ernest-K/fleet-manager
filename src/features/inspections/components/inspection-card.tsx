import React from "react";
import DetailRow from "@/components/detail-row";
import { CalendarIcon, FileWarning, ListCheck, Notebook, Pencil, UserRound } from "lucide-react";
import { format } from "date-fns";
import { Inspection } from "@/features/inspections/types";
import { Button } from "@/components/ui/button";
import InspectionDialog from "@/features/inspections/components/inspection-dialog";
import { Checkbox } from "@/components/ui/checkbox";

type InspectionCardProps = {
  inspection: Inspection;
};

function InspectionCard({ inspection }: InspectionCardProps) {
  return (
    <div className="border-border border-[1px] rounded-lg p-6 flex flex-col justify-center gap-3 relative grow">
      <InspectionDialog
        inspection={inspection}
        trigger={
          <Button variant="ghost" size="icon" className="absolute top-6 right-6">
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <div className="flex flex-col justify-evenly gap-3">
        {inspection.createdByUser && (
          <div className="flex flex-col sm:flex-row gap-3 ">
            <DetailRow Icon={UserRound} label="Role" value={inspection.createdByUser.role} />
            <div className="flex gap-3 ml-10 sm:ml-0">
              <DetailRow label="First name" value={inspection.createdByUser.firstName} />
              <DetailRow label="Last name" value={inspection.createdByUser.lastName} />
            </div>
          </div>
        )}
        <DetailRow Icon={FileWarning} label="Issue type" value={inspection.type} />
        <DetailRow Icon={CalendarIcon} label="Inspection date" value={format(inspection.date.toDate(), "PPP")} />
        <div className="flex gap-6 items-top">
          <ListCheck className="w-4 h-4 md:w-6 md:h-6 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground capitalize">Checklist:</p>
            {inspection.checklist && inspection.checklist.length ? (
              inspection.checklist.map((checklistItem, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Checkbox checked={checklistItem.checked} className="cursor-default" />
                  <p className="md:text-lg">{checklistItem.name}</p>
                </div>
              ))
            ) : (
              <p className="md:text-lg">n/a</p>
            )}
          </div>
        </div>
        <DetailRow Icon={Notebook} label="Notes" value={inspection.notes} />
      </div>
    </div>
  );
}

export default InspectionCard;
