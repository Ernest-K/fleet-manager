import { ReactElement } from "react";
import { useAuth } from "@/providers/auth-provider";
import { DriverLayout } from "@/layouts/driver-layout";
import DashboardContentHeader from "@/components/dashboard-content-header";
import DriverDetail from "@/features/drivers/components/driver-detail";
import { useGetInspectionsByManagerUid } from "@/features/inspections/hooks/useGetInspections";
import { useGetServicesByManagerUid } from "@/features/services/hooks/useGetServices";
import { useGetIssuesByManagerUid } from "@/features/issues/hooks/useGetIssues";
import VehicleEventTabs from "@/components/vehicle-event-tabs";
import { useUser } from "@/providers/user-provider";
import IssueDialog from "@/features/issues/components/issue-dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

const DriverPage = () => {
  const { authUser } = useAuth();
  const { user } = useUser();
  const { data: inspections, isLoading: isInspectionsLoading } = useGetInspectionsByManagerUid(user?.managerUid!);
  const { data: services, isLoading: isServicesLoading } = useGetServicesByManagerUid(user?.managerUid!);
  const { data: issues, isLoading: isIssuesLoading } = useGetIssuesByManagerUid(user?.managerUid!);

  if (!authUser || !user) {
    return "Loading...";
  }

  return (
    <>
      <DashboardContentHeader title="Home" />
      <section className="pb-6 space-y-6">
        <DriverDetail driverUid={authUser?.uid} />
        <IssueDialog
          trigger={
            <Button>
              <TriangleAlert className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:block">Report an issue</span>
            </Button>
          }
        />
        <VehicleEventTabs inspections={inspections} services={services} issues={issues} />
      </section>
    </>
  );
};

DriverPage.getLayout = function getLayout(page: ReactElement) {
  return <DriverLayout>{page}</DriverLayout>;
};

export default DriverPage;
