import DashboardContentHeader from "@/components/dashboard-content-header";
import EditProfileCard from "@/components/edit-profile-card";
import EditCredentialCard from "@/features/auth/components/edit-credential-card";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const SettingsPage = () => {
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

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SettingsPage;
