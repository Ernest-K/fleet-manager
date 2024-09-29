import DashboardContentHeader from "@/components/dashboard-content-header";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Separator } from "@/components/ui/separator";
import { ReactElement } from "react";
import VehicleForm from "@/features/vehicles/components/vehicle-form";
import { useRouter } from "next/router";
import { useGetVehicle } from "@/features/vehicles/hooks/useGetVehicle";

const EditVehiclePage = () => {
  const router = useRouter();
  const { uid: vehicleUid } = router.query;
  const validVehicleUid = !vehicleUid || Array.isArray(vehicleUid) ? "" : vehicleUid;

  const { data: vehicle, isLoading } = useGetVehicle({ vehicleUid: validVehicleUid });

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (!validVehicleUid || !vehicle) {
    return <p>Invalid vehicle uid</p>;
  }

  return (
    <>
      <DashboardContentHeader title="Edit vehicle" includeBackButton={true} />
      <Separator />
      <section className="py-6 flex flex-col gap-6 items-center">
        <VehicleForm vehicle={vehicle} />
      </section>
    </>
  );
};

EditVehiclePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default EditVehiclePage;
