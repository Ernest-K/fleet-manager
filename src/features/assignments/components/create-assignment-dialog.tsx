import React, { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import CreateAssignmentForm from "./create-assignment-form";

const TODAY = new Date();

type CreateAssignmentDialogProps = {
  trigger: ReactNode;
};

function CreateAssignmentDialog({ trigger }: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl overflow-y-scroll max-h-screen no-scrollbar">
        <DialogHeader>
          <DialogTitle>Create assignment</DialogTitle>
          <DialogDescription>Choose driver, vehicle and date range to create assignment.</DialogDescription>
        </DialogHeader>
        <CreateAssignmentForm onSubmit={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateAssignmentDialog;
