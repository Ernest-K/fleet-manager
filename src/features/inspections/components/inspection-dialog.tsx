import React, { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Inspection } from "@/features/inspections/types";
import InspectionForm from "@/features/inspections/components/inspection-form";

type ServiceDialogProps = {
  inspection?: Inspection;
  trigger: ReactNode;
};

function InspectionDialog({ inspection, trigger }: ServiceDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-scroll max-h-screen no-scrollbar">
        <DialogHeader>
          <DialogTitle>Schedule an inspection</DialogTitle>
          <DialogDescription>Use this form to schedule an inspection</DialogDescription>
        </DialogHeader>
        <InspectionForm inspection={inspection} onSubmit={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default InspectionDialog;
