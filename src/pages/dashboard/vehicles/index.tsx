import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const VehiclesPage = () => {
  return (
    <>
      <header className="w-full">
        <h2 className="text-2xl font-medium">Vehicles</h2>
      </header>
    </>
  );
};

VehiclesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehiclesPage;
