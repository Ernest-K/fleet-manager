import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import BackButton from "@/components/back-button";
import { useGetDriver } from "@/features/drivers/hooks/useGetDriver";
import ProfilePhotoUploader from "@/components/profile-photo-uploader";
import EditDriverForm from "@/features/drivers/components/edit-driver-form";
import DashboardContentHeader from "@/components/dashboard-content-header";
import { Button } from "@/components/ui/button";

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
      <section className="py-5 max-w-2xl flex flex-col gap-6">
        <ProfilePhotoUploader uid={driver.uid} currentPhotoURL={driver.photoURL} />
        <EditDriverForm driver={driver} />
      </section>
    </>
  );
};

DriverEditPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DriverEditPage;
