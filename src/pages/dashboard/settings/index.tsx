import DashboardContentHeader from "@/components/dashboard-content-header";
import ProfileForm from "@/components/profile-form";
import ProfilePhotoUploader from "@/components/profile-photo-uploader";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useUser } from "@/providers/user-provider";
import { ReactElement } from "react";

const SettingsPage = () => {
  const { user, refreshUser } = useUser();

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <>
      <DashboardContentHeader title="Settings" description="Manage your account settings" />
      <Separator />
      <section className="py-6 max-w-2xl flex flex-col gap-6">
        <ProfilePhotoUploader uid={user.uid} currentPhotoURL={user.photoURL} onUploadSuccess={() => refreshUser()} />
        <ProfileForm />
      </section>
    </>
  );
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SettingsPage;
