import DashboardContentHeader from "@/components/dashboard-content-header";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Separator } from "@/components/ui/separator";
import { ReactElement } from "react";
import VehicleForm from "@/features/vehicles/components/vehicle-form";

const CreateVehiclePage = () => {
  return (
    <>
      <DashboardContentHeader title="Add new vehicle" includeBackButton={true} />
      <Separator />
      <section className="py-6 flex flex-col gap-6 items-center">
        <VehicleForm />
      </section>
    </>
  );
};

CreateVehiclePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateVehiclePage;
