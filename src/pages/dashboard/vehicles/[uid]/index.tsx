import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "@/components/ui/use-toast";
import DashboardContentHeader from "@/components/dashboard-content-header";
import { useDeleteVehicle } from "@/features/vehicles/hooks/useDeleteVehicle";
import VehicleDetail from "@/features/vehicles/components/vehicle-detail";
import VehicleDocumentsCard from "@/features/vehicles/components/vehicle-documents-card";
import VehiclePhotoUploader from "@/features/vehicles/components/vehicle-photo-uploader";
import { useGetVehicle } from "@/features/vehicles/hooks/useGetVehicle";
import queryClient from "@/lib/queryClient";

const VehicleDetailPage = () => {
  const router = useRouter();
  const { uid: vehicleUid } = router.query;
  const { authUser } = useAuth();
  const { mutate: deleteVehicle, isPending } = useDeleteVehicle({ managerUid: authUser!.uid });
  const validVehicleUid = !vehicleUid || Array.isArray(vehicleUid) ? "" : vehicleUid;
  const { data: vehicle, isLoading } = useGetVehicle({ vehicleUid: validVehicleUid });

  const handleDeleteVehicle = () => {
    deleteVehicle(validVehicleUid, {
      onSuccess: () => {
        toast({
          description: "Vehicle deleted successfully!",
        });
        router.push("/dashboard/vehicles");
      },
    });
  };

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (!validVehicleUid || !vehicle) {
    return <p>Invalid vehicle uid</p>;
  }

  return (
    <>
      <DashboardContentHeader title="Vehicle details" includeBackButton={true}>
        <div className="ml-auto flex gap-6">
          <Button asChild variant="outline">
            <Link href={`/dashboard/vehicles/${vehicleUid}/edit`}>
              <Pencil className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Edit vehicle</span>
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete vehicle.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" onClick={handleDeleteVehicle}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardContentHeader>
      <section className="flex flex-col gap-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <VehicleDetail vehicle={vehicle} />
          <VehiclePhotoUploader
            vehicleUid={vehicle.uid}
            photosURL={vehicle?.photosURL}
            onUpload={() => {
              queryClient.invalidateQueries({ queryKey: ["vehicle", validVehicleUid] });
            }}
          />
        </div>
        <VehicleDocumentsCard vehicleUid={validVehicleUid} />
      </section>
    </>
  );
};

VehicleDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehicleDetailPage;
