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
import { Role } from "@/features/auth/types";
import NoData from "@/components/no-data";
import { useDeleteInspection } from "@/features/inspections/hooks/useDeleteInspection";
import InspectionSheet from "@/features/inspections/components/inspection-sheet";
import { Inspection } from "@/features/inspections/types";

type InspectionTableProps = {
  inspections: Inspection[] | undefined;
};

function InspectionTable({ inspections }: InspectionTableProps) {
  const { authUser } = useAuth();

  const { mutate: deleteInspection, isPending } = useDeleteInspection({ userUid: authUser!.uid });
  const [deletingInspectionUid, setDeletingInspectionUid] = useState<string | null>(null);

  const handleDeleteInspection = (inspectionUid: string) => {
    setDeletingInspectionUid(inspectionUid);
    deleteInspection(inspectionUid, {
      onSuccess: () => {
        toast({
          description: "Inspection deleted successfully",
        });
        setDeletingInspectionUid(null);
      },
      onError: () => {
        setDeletingInspectionUid(null);
      },
    });
  };

  if (!inspections || !inspections.length) return <NoData title="No inspections scheduled" />;

  return (
    <Table>
      <TableCaption>List of inspections</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Created by</TableHead>
          <TableHead>Inspection date</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Inspection type</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead className="max-w-16 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inspections &&
          inspections.map((inspection) => (
            <TableRow key={inspection.uid}>
              <TableCell className="flex items-center">
                {inspection.createdByUser?.role === Role.Driver ? (
                  <Link className={`${buttonVariants({ variant: "link" })} pl-0 space-x-3`} href={`/dashboard/drivers/${inspection.createdByUser?.uid}`}>
                    <Avatar>
                      <AvatarImage src={inspection.createdByUser?.photoURL ? inspection?.createdByUser.photoURL : "/default-profile-photo.jpg"} />
                      <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{`${inspection.createdByUser?.firstName} ${inspection.createdByUser?.lastName}`}</span>
                      <p className="text-muted-foreground text-xs">{inspection.createdByUser?.email}</p>
                    </div>
                  </Link>
                ) : (
                  <div className={`${buttonVariants({ variant: "link" })} pl-0 hover:no-underline space-x-3`}>
                    <Avatar>
                      <AvatarImage src={inspection.createdByUser?.photoURL ? inspection?.createdByUser.photoURL : "/default-profile-photo.jpg"} />
                      <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{`${inspection.createdByUser?.firstName} ${inspection.createdByUser?.lastName}`}</span>
                      <p className="text-muted-foreground text-xs">{inspection.createdByUser?.email}</p>
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell>{format(inspection.date.toDate(), "PP")}</TableCell>
              <TableCell>{inspection.vehicle && <Link className={`${buttonVariants({ variant: "link" })} pl-0`} href={`/dashboard/vehicles/${inspection.vehicle?.uid}`}>{`${inspection.vehicle?.make} ${inspection.vehicle?.model}`}</Link>}</TableCell>
              <TableCell>{inspection.type}</TableCell>
              <TableCell>{format(inspection.createdAt.toDate(), "P - HH:mm")}</TableCell>
              <TableCell className="text-center ">
                <div className="sm:gap-3 flex flex-col sm:flex-row justify-center items-center">
                  <InspectionSheet
                    trigger={
                      <Button size="icon" variant="ghost">
                        <Eye className="h-5 w-5" />
                      </Button>
                    }
                    inspection={inspection}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteInspection(inspection.uid)} disabled={deletingInspectionUid === inspection.uid}>
                    {deletingInspectionUid === inspection.uid ? <Icons.spinner className="h-5 w-5 animate-spin" /> : <X className="w-5 h-5" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default InspectionTable;
