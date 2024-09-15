import DashboardContentHeader from "@/components/dashboard-content-header";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Separator } from "@/components/ui/separator";
import { ReactElement } from "react";
import CreateVehicleForm from "@/features/vehicles/components/create-vehicle-form";

const CreateVehiclePage = () => {
  return (
    <>
      <DashboardContentHeader title="Add new vehicle" includeBackButton={true} />
      <Separator />
      <section className="py-6 flex flex-col gap-6 items-center">
        <CreateVehicleForm />
      </section>
    </>
  );
};

CreateVehiclePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateVehiclePage;
