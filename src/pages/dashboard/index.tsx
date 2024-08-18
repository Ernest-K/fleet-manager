import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const DashboardPage = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="h-[200rem]"></div>
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
