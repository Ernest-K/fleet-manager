import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useGetVehicles } from "@/features/vehicles/hooks/useGetVehicles";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useDeleteVehicle } from "@/features/vehicles/hooks/useDeleteVehicle";

function VehicleTable() {
  const { authUser } = useAuth();
  const { data, isLoading } = useGetVehicles({ managerUid: authUser!.uid });
  const { mutate: deleteVehicle, isPending } = useDeleteVehicle({ managerUid: authUser!.uid });

  const handleDeleteVehicle = (vehicleUid: string) => {
    deleteVehicle(vehicleUid, {
      onSuccess: () => {
        toast({
          description: "Vehicle deleted successfully",
        });
      },
    });
  };

  return (
    <Table>
      <TableCaption>List of vehicles</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Make</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>License Plate Number</TableHead>
          <TableHead>Technical Inspection Date</TableHead>
          <TableHead>Insurance Policy Date</TableHead>
          <TableHead className="max-w-16 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((vehicle) => (
            <TableRow key={vehicle.uid}>
              <TableCell>{vehicle.make}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>
                <Badge>{vehicle.status}</Badge>
              </TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>{vehicle.licensePlateNumber}</TableCell>
              <TableCell>{format(vehicle.technicalInspectionDate.toDate(), "PP")}</TableCell>
              <TableCell>{format(vehicle.insurancePolicyDate.toDate(), "PP")}</TableCell>
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
                      <Link href={`vehicles/${vehicle.uid}`}>View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`vehicles/${vehicle.uid}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteVehicle(vehicle.uid)}>
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

export default VehicleTable;
