import React, { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ServiceForm from "@/features/services/components/service-form";
import { Service } from "@/features/services/types";

type ServiceDialogProps = {
  vehicleUid?: string;
  service?: Service;
  trigger: ReactNode;
};

function ServiceDialog({ vehicleUid, service, trigger }: ServiceDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-scroll max-h-screen no-scrollbar">
        <DialogHeader>
          <DialogTitle>Schedule a service</DialogTitle>
          <DialogDescription>Use this form to schedule a service</DialogDescription>
        </DialogHeader>
        <ServiceForm vehicleUid={vehicleUid} service={service} onSubmit={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default ServiceDialog;
