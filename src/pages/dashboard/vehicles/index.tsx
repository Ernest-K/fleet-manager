import DashboardContentHeader from "@/components/dashboard-content-header";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const VehiclesPage = () => {
  return (
    <>
      <DashboardContentHeader title="Vehicles" />
    </>
  );
};

VehiclesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehiclesPage;
