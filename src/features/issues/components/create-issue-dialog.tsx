import React, { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import CreateIssueForm from "./create-issue-form";

type CreateIssueDialogProps = {
  trigger: ReactNode;
};

function CreateIssueDialog({ trigger }: CreateIssueDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-scroll max-h-screen no-scrollbar">
        <DialogHeader>
          <DialogTitle>Report an issue</DialogTitle>
          <DialogDescription>Use this form to report any issues with vehicle</DialogDescription>
        </DialogHeader>
        <CreateIssueForm onSubmit={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateIssueDialog;
