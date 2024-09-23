import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { useGetDrivers } from "@/features/drivers/hooks/useGetDrivers";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useDeleteDriver } from "@/features/drivers/hooks/useDeleteDriver";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function DriverTable() {
  const { authUser } = useAuth();
  const { data, isLoading } = useGetDrivers({ managerUid: authUser!.uid });
  const { mutate: deleteDriver, isPending } = useDeleteDriver({ managerUid: authUser!.uid });

  const handleDeleteDriver = (driverUid: string) => {
    deleteDriver(driverUid, {
      onSuccess: () => {
        toast({
          description: "Driver deleted successfully",
        });
      },
    });
  };

  return (
    <Table>
      <TableCaption>List of drivers</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Photo</TableHead>
          <TableHead>First name</TableHead>
          <TableHead>Last name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Driver&apos;s License Number</TableHead>
          <TableHead className="max-w-16 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((driver) => (
            <TableRow key={driver.uid}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={driver.photoURL ? driver.photoURL : "/default-profile-photo.jpg"} />
                  <AvatarFallback>FM</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{driver.firstName}</TableCell>
              <TableCell>{driver.lastName}</TableCell>
              <TableCell>
                <Badge>{driver.status}</Badge>
              </TableCell>
              <TableCell>{driver.email}</TableCell>
              <TableCell>{driver.phone}</TableCell>
              <TableCell>{driver.licenseNumber}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`drivers/${driver.uid}`}>View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`drivers/${driver.uid}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDriver(driver.uid)}>
                      Delete <Trash2 size={16} className="ml-auto" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default DriverTable;
