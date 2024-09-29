import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAssignments } from "@/features/assignments/hooks/useGetAssignments";
import { format } from "date-fns";
import { useDeleteAssignment } from "@/features/assignments/hooks/useDeleteAssignment";
import { Icons } from "@/components/ui/icons";
import AssignmentSheet from "@/features/assignments/components/assignment-sheet";
import NoData from "@/components/no-data";

function AssignmentTable() {
  const { authUser } = useAuth();
  const { data, isLoading } = useGetAssignments({ managerUid: authUser!.uid });
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

  if (data && !data.length) return <NoData title="No assignments found" description="There are currently no assignments in your fleet." />;

  return (
    <Table>
      <TableCaption>List of assignments</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Photo</TableHead>
          <TableHead>First name</TableHead>
          <TableHead>Last name</TableHead>
          <TableHead>Make</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>License Plate Number</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="max-w-16 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((assignment) => (
            <TableRow key={assignment.uid}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={assignment.driver.photoURL ? assignment.driver.photoURL : "/default-profile-photo.jpg"} />
                  <AvatarFallback>FM</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{assignment.driver?.firstName}</TableCell>
              <TableCell>{assignment.driver?.lastName}</TableCell>
              <TableCell>{assignment.vehicle?.make}</TableCell>
              <TableCell>{assignment.vehicle?.model}</TableCell>
              <TableCell>{assignment.vehicle?.licensePlateNumber}</TableCell>
              <TableCell>{format(assignment.dateRange.from.toDate(), "PP")}</TableCell>
              <TableCell>{format(assignment.dateRange.to.toDate(), "PP")}</TableCell>
              <TableCell className="text-center sm:gap-3 flex flex-col sm:flex-row justify-center items-center">
                <AssignmentSheet
                  trigger={
                    <Button size="icon" variant="ghost">
                      <Eye className="h-5 w-5" />
                    </Button>
                  }
                  driver={assignment.driver}
                  vehicle={assignment.vehicle}
                />
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

export default AssignmentTable;
