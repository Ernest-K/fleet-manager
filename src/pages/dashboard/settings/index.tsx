import ProfileForm from "@/components/profile-form";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement } from "react";

const SettingsPage = () => {
  return (
    <>
      <header className="py-3">
        <h2 className="text-2xl font-medium">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </header>
      <Separator />
      <section className="py-3 max-w-2xl">
        <ProfileForm />
      </section>
    </>
  );
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SettingsPage;
