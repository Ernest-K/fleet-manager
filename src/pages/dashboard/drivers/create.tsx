import DashboardContentHeader from "@/components/dashboard-content-header";
import CreateDriverForm from "@/features/drivers/components/create-driver-form";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Separator } from "@/components/ui/separator";
import { ReactElement } from "react";

const CreateDriverPage = () => {
  return (
    <>
      <DashboardContentHeader title="Add new driver" includeBackButton={true} />
      <Separator />
      <section className="py-6 max-w-xl flex flex-col gap-6">
        <CreateDriverForm />
      </section>
    </>
  );
};

CreateDriverPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateDriverPage;
