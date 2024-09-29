import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import BackButton from "@/components/back-button";
import { useGetDriver } from "@/features/drivers/hooks/useGetDriver";
import ProfilePhotoUploader from "@/components/profile-photo-uploader";
import EditDriverForm from "@/features/drivers/components/edit-driver-form";
import DashboardContentHeader from "@/components/dashboard-content-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const DriverEditPage = () => {
  const router = useRouter();
  const { uid: driverUid } = router.query;
  const validDriverUid = !driverUid || Array.isArray(driverUid) ? "" : driverUid;

  const { data: driver, isLoading } = useGetDriver({ driverUid: validDriverUid });

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (!validDriverUid || !driver) {
    return <p>Invalid driver uid</p>;
  }

  return (
    <>
      <DashboardContentHeader title="Edit driver" includeBackButton={true} />
      <Separator />
      <section className="py-6 flex flex-col gap-6 items-center">
        <div className="space-y-6">
          <header>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p className="text-sm text-muted-foreground">Update the fundamental details of the driver.</p>
          </header>
          <ProfilePhotoUploader uid={driver.uid} currentPhotoURL={driver.photoURL} />
          <EditDriverForm driver={driver} />
        </div>
      </section>
    </>
  );
};

DriverEditPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DriverEditPage;
