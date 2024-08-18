import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const DashboardPage = () => {
  return (
    <>
      <h1>Hello</h1>
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
