import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const DashboardPage = () => {
  return (
    <>
      <header className="w-full flex justify-start">
        <h2 className="text-2xl font-medium">Dashboard</h2>
      </header>
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
