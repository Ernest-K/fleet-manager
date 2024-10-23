import { ReactElement } from "react";

import { Car, LucideIcon, UserRoundPen, UsersRound } from "lucide-react";
import { createChartConfig } from "@/lib/utils";

import DashboardContentHeader from "@/components/dashboard-content-header";
import DriverStatusChart from "@/features/drivers/components/driver-status-chart";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VehicleStatusChart from "@/features/vehicles/components/vehicle-status-chart";
import { TypeChart } from "@/components/type-chart";
import { SkeletonChart } from "@/components/skeleton-chart";
import { Skeleton } from "@/components/ui/skeleton";
import VehicleEventTabs from "@/components/vehicle-event-tabs";

import { useGetDrivers } from "@/features/drivers/hooks/useGetDrivers";
import { useAuth } from "@/providers/auth-provider";
import { useGetVehicles } from "@/features/vehicles/hooks/useGetVehicles";
import { useGetAssignments } from "@/features/assignments/hooks/useGetAssignments";
import { useGetInspectionsByManagerUid } from "@/features/inspections/hooks/useGetInspections";
import { useGetServicesByManagerUid } from "@/features/services/hooks/useGetServices";

import { InspectionType } from "@/features/inspections/types";
import { IssueType } from "@/features/issues/types";
import { useGetIssuesByManagerUid } from "@/features/issues/hooks/useGetIssues";
import { ServiceType } from "@/features/services/types";

const inspectionTypeChartConfig = createChartConfig(InspectionType);
const serviceTypeChartConfig = createChartConfig(ServiceType);
const issueTypeChartConfig = createChartConfig(IssueType);

const DashboardPage = () => {
  const { authUser } = useAuth();
  const { data: drivers, isLoading: isDriversLoading } = useGetDrivers({ managerUid: authUser!.uid });
  const { data: vehicles, isLoading: isVehiclesLoading } = useGetVehicles({ managerUid: authUser!.uid });
  const { data: assignments, isLoading: isAssignmentsLoading } = useGetAssignments({ managerUid: authUser!.uid });
  const { data: inspections, isLoading: isInspectionsLoading } = useGetInspectionsByManagerUid(authUser!.uid);
  const { data: services, isLoading: isServicesLoading } = useGetServicesByManagerUid(authUser!.uid);
  const { data: issues, isLoading: isIssuesLoading } = useGetIssuesByManagerUid(authUser!.uid);

  return (
    <>
      <DashboardContentHeader title="Dashboard" />
      <section className="pb-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
          {isDriversLoading ? (
            <SkeletonTotalCountCard />
          ) : (
            drivers && <TotalCountCard title="Total number of drivers" count={drivers?.length} Icon={UsersRound} />
          )}
          {isVehiclesLoading ? <SkeletonTotalCountCard /> : vehicles && <TotalCountCard title="Total number of vehicles" count={vehicles?.length} Icon={Car} />}
          {isAssignmentsLoading ? (
            <SkeletonTotalCountCard />
          ) : (
            assignments && <TotalCountCard title="Total number of assignments" count={assignments?.length} Icon={UserRoundPen} />
          )}

          {isDriversLoading ? <SkeletonChart className="sm:col-span-3" /> : <DriverStatusChart drivers={drivers || []} />}
          {isVehiclesLoading ? <SkeletonChart className="sm:col-span-3" /> : <VehicleStatusChart vehicles={vehicles || []} />}
          {isInspectionsLoading ? (
            <SkeletonChart className="sm:col-span-2" />
          ) : (
            <TypeChart
              title="Inspection Type"
              description="Overview of Inspection Types"
              data={inspections || []}
              typeKey="type"
              config={inspectionTypeChartConfig}
              labelTotal="Inspections"
              unit="inspections"
            />
          )}
          {isServicesLoading ? (
            <SkeletonChart className="sm:col-span-2" />
          ) : (
            <TypeChart
              title="Service Type"
              description="Overview of Service Types"
              data={services || []}
              typeKey="type"
              config={serviceTypeChartConfig}
              labelTotal="Services"
              unit="services"
            />
          )}
          {isIssuesLoading ? (
            <SkeletonChart className="sm:col-span-2" />
          ) : (
            <TypeChart
              title="Issue Type"
              description="Overview of Issue Types"
              data={issues || []}
              typeKey="type"
              config={issueTypeChartConfig}
              labelTotal="Issues"
              unit="issues"
            />
          )}
        </div>
        <VehicleEventTabs inspections={inspections} services={services} issues={issues} />
      </section>
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const TotalCountCard = ({ Icon, title, count, description }: { Icon?: LucideIcon; title: string; count: number; description?: string }) => {
  return (
    <Card className="sm:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const SkeletonTotalCountCard = () => (
  <Card className="sm:col-span-2">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="w-1/2 h-4" />
      <Skeleton className="h-5 w-5" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-6 w-12" />
    </CardContent>
  </Card>
);

export default DashboardPage;
