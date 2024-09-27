import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAssignments } from "@/features/assignments/hooks/useGetAssignments";
import { format } from "date-fns";
import { useDeleteAssignment } from "@/features/assignments/hooks/useDeleteAssignment";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";

type EntityAssignmentTableProps = {
  entityUid: string;
  entityType: "driver" | "vehicle";
};

function EntityAssignmentTable({ entityUid, entityType }: EntityAssignmentTableProps) {
  const { authUser } = useAuth();
  const { data: assignments, isLoading } = useGetAssignments({
    managerUid: authUser!.uid,
    driverUid: entityType === "driver" ? entityUid : undefined,
    vehicleUid: entityType === "vehicle" ? entityUid : undefined,
  });
  const { mutate: deleteAssignment, isPending } = useDeleteAssignment({ managerUid: authUser!.uid });
  const [deletingAssignmentUid, setDeletingAssignmentUid] = useState<string | null>(null);

  const handleDeleteAssignment = (assignmentUid: string) => {
    setDeletingAssignmentUid(assignmentUid);
    deleteAssignment(assignmentUid, {
      onSuccess: () => {
        toast({
          description: "Assignment deleted successfully",
        });
        setDeletingAssignmentUid(null);
      },
      onError: () => {
        setDeletingAssignmentUid(null);
      },
    });
  };

  return (
    <Table>
      <TableCaption>List of assignments</TableCaption>
      <TableHeader>
        <TableRow>
          {entityType === "driver" ? (
            <>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>License Plate</TableHead>
            </>
          ) : (
            <>
              <TableHead>Photo</TableHead>
              <TableHead>First name</TableHead>
              <TableHead>Last name</TableHead>
            </>
          )}
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments &&
          assignments.map((assignment) => (
            <TableRow key={assignment.uid}>
              {entityType === "driver" ? (
                <>
                  <TableCell>{assignment.vehicle?.make || "N/A"}</TableCell>
                  <TableCell>{assignment.vehicle?.model || "N/A"}</TableCell>
                  <TableCell>{assignment.vehicle?.licensePlateNumber || "N/A"}</TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={assignment.driver?.photoURL || "/default-profile-photo.jpg"} />
                      <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{assignment.driver?.firstName || "N/A"}</TableCell>
                  <TableCell>{assignment.driver?.lastName || "N/A"}</TableCell>
                </>
              )}
              <TableCell>{format(assignment.dateRange.from.toDate(), "PP")}</TableCell>
              <TableCell>{format(assignment.dateRange.to.toDate(), "PP")}</TableCell>
              <TableCell className="text-center sm:gap-3 flex flex-col sm:flex-row justify-center items-center">
                <Button size="icon" variant="ghost" asChild>
                  <Link href={entityType === "driver" ? `/dashboard/vehicles/${assignment.vehicleUid}` : `/dashboard/drivers/${assignment.driverUid}`}>
                    <SquareArrowOutUpRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAssignment(assignment.uid)} disabled={deletingAssignmentUid === assignment.uid}>
                  {deletingAssignmentUid === assignment.uid ? <Icons.spinner className="h-5 w-5 animate-spin" /> : <X className="w-5 h-5" />}
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default EntityAssignmentTable;
