import DashboardContentHeader from "@/components/dashboard-content-header";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const DashboardPage = () => {
  return (
    <>
      <DashboardContentHeader title="Dashboard" />
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
