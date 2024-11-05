import DashboardContentHeader from "@/components/dashboard-content-header";
import EditProfileCard from "@/components/edit-profile-card";
import LoadingButton from "@/components/loading-button";
import { toast } from "@/components/ui/use-toast";
import EditCredentialCard from "@/features/auth/components/edit-credential-card";
import { Role } from "@/features/auth/types";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/providers/user-provider";
import { ReactElement, ReactNode, useEffect, useState } from "react";

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/updateStatus", {
        method: "POST",
      });
      if (response.ok) {
        toast({
          description: "Statuses updated successfully",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update status.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update status.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTechnicalInspectionReminder = async () => {
    setSending(true);
    try {
      const response = await fetch("/api/sendTechnicalInspectionEmail", {
        method: "POST",
      });
      const data = await response.json();
      toast({
        description: "Emails sent successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error sending emails",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <DashboardContentHeader title="Settings" description="Manage your account settings" />
      <section className=" max-w-2xl flex flex-col gap-6">
        <EditProfileCard />
        <EditCredentialCard />
        <Protected allowedRoles={[Role.Manager]}>
          <div className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium">Update status</h3>
              <p className="text-muted-foreground text-sm">Click to manually update the statuses of drivers and vehicles</p>
            </div>
            <LoadingButton label="Update status" loadingLabel="Updating" onClick={handleUpdateStatus} isLoading={loading} />
          </div>

          <div className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium">Technical inspection notification</h3>
              <p className="text-muted-foreground text-sm">Click to manually send technical inspection email notifications</p>
            </div>
            <LoadingButton label="Send emails" loadingLabel="Sending" onClick={handleSendTechnicalInspectionReminder} isLoading={sending} />
          </div>
        </Protected>
      </section>
    </>
  );
};

const Protected = ({ children, allowedRoles }: { children: ReactNode; allowedRoles: string[] }) => {
  const { user } = useUser();

  if (!user) {
    return "";
  }

  if (user.role && !allowedRoles.includes(user.role)) {
    return "";
  }

  return <>{children}</>;
};

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SettingsPage;
