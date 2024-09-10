import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Trash2, UserRoundPen } from "lucide-react";
import DriverDetail from "@/features/drivers/components/driver-detail";
import Link from "next/link";
import { useDeleteDriver } from "@/features/drivers/hooks/useDeleteDriver";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "@/components/ui/use-toast";
import DashboardContentHeader from "@/components/dashboard-content-header";
import DriverDocumentsCard from "@/features/drivers/components/driver-documents-card";

const DriverDetailPage = () => {
  const router = useRouter();
  const { uid: driverUid } = router.query;
  const { authUser } = useAuth();
  const { mutate: deleteDriver, isPending } = useDeleteDriver({ managerUid: authUser!.uid });
  const validDriverUid = !driverUid || Array.isArray(driverUid) ? "" : driverUid;

  const handleDeleteDriver = () => {
    deleteDriver(validDriverUid, {
      onSuccess: () => {
        toast({
          description: "Driver deleted successfully!",
        });
        router.push("/dashboard/drivers");
      },
    });
  };

  if (!validDriverUid) {
    return <p>Invalid driver uid</p>;
  }

  return (
    <>
      <DashboardContentHeader title="Driver details" includeBackButton={true}>
        <div className="ml-auto flex gap-6">
          <Button asChild variant="outline">
            <Link href={`/dashboard/drivers/${driverUid}/edit`}>
              <UserRoundPen className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Edit driver</span>
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
                <AlertDialogDescription>This action cannot be undone. This will permanently delete driver.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" onClick={handleDeleteDriver}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardContentHeader>
      <section className="flex flex-col gap-6">
        <DriverDetail driverUid={validDriverUid} />
        <DriverDocumentsCard driverUid={validDriverUid} />
      </section>
    </>
  );
};

DriverDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DriverDetailPage;
