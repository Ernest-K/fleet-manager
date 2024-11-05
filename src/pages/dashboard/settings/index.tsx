import DashboardContentHeader from "@/components/dashboard-content-header";
import EditProfileCard from "@/components/edit-profile-card";
import LoadingButton from "@/components/loading-button";
import EditCredentialCard from "@/features/auth/components/edit-credential-card";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ReactElement, useState } from "react";

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/updateStatus", {
        method: "POST",
      });
      if (response.ok) {
        alert("Status updated successfully!");
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardContentHeader title="Settings" description="Manage your account settings" />
      <section className=" max-w-2xl flex flex-col gap-6">
        <EditProfileCard />
        <EditCredentialCard />
        <LoadingButton label="Update status" loadingLabel="Updating" onClick={handleUpdateStatus} isLoading={loading} />
      </section>
    </>
  );
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SettingsPage;
