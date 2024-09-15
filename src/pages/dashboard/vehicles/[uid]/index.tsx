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

const VehicleDetailPage = () => {
  const router = useRouter();
  const { uid: vehicleUid } = router.query;
  const { authUser } = useAuth();
  const { mutate: deleteVehicle, isPending } = useDeleteVehicle({ managerUid: authUser!.uid });
  const validVehicleUid = !vehicleUid || Array.isArray(vehicleUid) ? "" : vehicleUid;

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

  if (!validVehicleUid) {
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
      <section className="flex flex-col gap-6">
        <VehicleDetail vehicleUid={validVehicleUid} />
        {/* <DriverDocumentsCard driverUid={validDriverUid} /> */}
      </section>
    </>
  );
};

VehicleDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehicleDetailPage;
