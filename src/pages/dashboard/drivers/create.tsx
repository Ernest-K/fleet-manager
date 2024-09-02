import BackButton from "@/components/back-button";
import CreateDriverForm from "@/features/drivers/components/create-driver-form";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const DriversPage = () => {
  return (
    <>
      <header className="w-full flex justify-start items-center gap-6">
        <BackButton />
        <h2 className="text-2xl font-medium">Create new driver</h2>
      </header>
      <section className="py-5 max-w-xl flex flex-col gap-5">
        <CreateDriverForm />
      </section>
    </>
  );
};

DriversPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DriversPage;
