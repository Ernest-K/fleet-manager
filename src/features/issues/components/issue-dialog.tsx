import React, { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Issue } from "@/features/issues/types";
import IssueForm from "@/features/issues/components/issue-form";

type CreateIssueDialogProps = {
  issue?: Issue;
  trigger: ReactNode;
};

function IssueDialog({ issue, trigger }: CreateIssueDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-scroll max-h-screen no-scrollbar">
        <DialogHeader>
          <DialogTitle>Report an issue</DialogTitle>
          <DialogDescription>Use this form to report any issues with vehicle</DialogDescription>
        </DialogHeader>
        <IssueForm issue={issue} onSubmit={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default IssueDialog;
