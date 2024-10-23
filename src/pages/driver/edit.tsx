import DashboardContentHeader from "@/components/dashboard-content-header";
import EditProfileCard from "@/components/edit-profile-card";
import EditCredentialCard from "@/features/auth/components/edit-credential-card";
import { DriverLayout } from "@/layouts/driver-layout";
import { ReactElement } from "react";

const EditPage = () => {
  return (
    <>
      <DashboardContentHeader title="Settings" description="Manage your account settings" />
      <section className=" max-w-2xl flex flex-col gap-6">
        <EditProfileCard />
        <EditCredentialCard />
      </section>
    </>
  );
};

EditPage.getLayout = function getLayout(page: ReactElement) {
  return <DriverLayout>{page}</DriverLayout>;
};

export default EditPage;
