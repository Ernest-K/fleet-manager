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
import { useGetAssignments } from "@/features/assignments/hooks/useGetAssignments";
import { isDateBetweenRange } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import AssignedVehicleCard from "@/features/vehicles/components/assigned-vehicle-card";
import { Car } from "lucide-react";

const DriverPage = () => {
  const { authUser } = useAuth();
  const { user } = useUser();
  const { data: inspections, isLoading: isInspectionsLoading } = useGetInspectionsByManagerUid(user?.managerUid!);
  const { data: services, isLoading: isServicesLoading } = useGetServicesByManagerUid(user?.managerUid!);
  const { data: issues, isLoading: isIssuesLoading } = useGetIssuesByManagerUid(user?.managerUid!);
  const { data: assignments, isLoading: isAssignmentsLoading } = useGetAssignments({ managerUid: user?.managerUid!, driverUid: user?.uid! });

  const currentAssignment = assignments ? assignments.filter((assignment) => isDateBetweenRange(Timestamp.now(), assignment.dateRange))[0] : null;

  if (!authUser || !user) {
    return "Loading...";
  }

  return (
    <>
      <DashboardContentHeader title="Home" />
      <section className="pb-6 space-y-6">
        <DriverDetail driverUid={authUser?.uid} />
        {currentAssignment && currentAssignment.vehicle ? <AssignedVehicleCard vehicle={currentAssignment.vehicle} from={currentAssignment.dateRange.from} to={currentAssignment.dateRange.to} /> : <AssignedVehiclePlacehodler />}
        <VehicleEventTabs inspections={inspections} services={services} issues={issues} />
      </section>
    </>
  );
};

DriverPage.getLayout = function getLayout(page: ReactElement) {
  return <DriverLayout>{page}</DriverLayout>;
};

const AssignedVehiclePlacehodler = () => (
  <div className="border-border border-[1px] rounded-lg p-6 flex flex-col justify-center items-center min-h-56">
    <div className="inline-block p-6 bg-muted rounded-full mb-3">
      <Car className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-3">No assigned vehicle</h3>
  </div>
);

export default DriverPage;
