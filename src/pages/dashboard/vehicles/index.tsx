import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const VehiclesPage = () => {
  return <h1>Vehicles</h1>;
};

VehiclesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehiclesPage;
