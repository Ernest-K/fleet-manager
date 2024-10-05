import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/features/auth/types";
import NoData from "@/components/no-data";
import { useDeleteService } from "@/features/services/hooks/useDeleteService";
import ServiceSheet from "@/features/services/components/service-sheet";
import { Service } from "@/features/services/types";

type ServiceTableProps = {
  services: Service[] | undefined;
};

function ServiceTable({ services }: ServiceTableProps) {
  const { authUser } = useAuth();

  const { mutate: deleteService, isPending } = useDeleteService({ userUid: authUser!.uid });
  const [deletingServiceUid, setDeletingServiceUid] = useState<string | null>(null);

  const handleDeleteService = (serviceUid: string) => {
    setDeletingServiceUid(serviceUid);
    deleteService(serviceUid, {
      onSuccess: () => {
        toast({
          description: "Service deleted successfully",
        });
        setDeletingServiceUid(null);
      },
      onError: () => {
        setDeletingServiceUid(null);
      },
    });
  };

  if (!services || !services.length) return <NoData title="No services scheduled" />;

  return (
    <Table>
      <TableCaption>List of services</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Created by</TableHead>
          <TableHead>Service date</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Service type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead className="max-w-16 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services &&
          services.map((service) => (
            <TableRow key={service.uid}>
              <TableCell className="flex items-center">
                {service.createdByUser?.role === Role.Driver ? (
                  <Link className={`${buttonVariants({ variant: "link" })} pl-0 space-x-3`} href={`/dashboard/drivers/${service.createdByUser?.uid}`}>
                    <Avatar>
                      <AvatarImage src={service.createdByUser?.photoURL ? service?.createdByUser.photoURL : "/default-profile-photo.jpg"} />
                      <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{`${service.createdByUser?.firstName} ${service.createdByUser?.lastName}`}</span>
                      <p className="text-muted-foreground text-xs">{service.createdByUser?.email}</p>
                    </div>
                  </Link>
                ) : (
                  <div className={`${buttonVariants({ variant: "link" })} pl-0 hover:no-underline space-x-3`}>
                    <Avatar>
                      <AvatarImage src={service.createdByUser?.photoURL ? service?.createdByUser.photoURL : "/default-profile-photo.jpg"} />
                      <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{`${service.createdByUser?.firstName} ${service.createdByUser?.lastName}`}</span>
                      <p className="text-muted-foreground text-xs">{service.createdByUser?.email}</p>
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell>{format(service.date.toDate(), "PP")}</TableCell>
              <TableCell>{service.vehicle && <Link className={`${buttonVariants({ variant: "link" })} pl-0`} href={`/dashboard/vehicles/${service.vehicle?.uid}`}>{`${service.vehicle?.make} ${service.vehicle?.model}`}</Link>}</TableCell>
              <TableCell>{service.type}</TableCell>
              <TableCell>
                <Badge>{service.status}</Badge>
              </TableCell>
              <TableCell>{format(service.createdAt.toDate(), "P - HH:mm")}</TableCell>
              <TableCell className="text-center ">
                <div className="sm:gap-3 flex flex-col sm:flex-row justify-center items-center">
                  <ServiceSheet
                    trigger={
                      <Button size="icon" variant="ghost">
                        <Eye className="h-5 w-5" />
                      </Button>
                    }
                    service={service}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.uid)} disabled={deletingServiceUid === service.uid}>
                    {deletingServiceUid === service.uid ? <Icons.spinner className="h-5 w-5 animate-spin" /> : <X className="w-5 h-5" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default ServiceTable;
