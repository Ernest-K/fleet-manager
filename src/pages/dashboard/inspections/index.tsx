import DashboardContentHeader from "@/components/dashboard-content-header";
import SkeletonTable from "@/components/skeleton-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InspectionDialog from "@/features/inspections/components/inspection-dialog";
import InspectionsTable from "@/features/inspections/components/inspections-table";
import { useGetInspectionsByManagerUid } from "@/features/inspections/hooks/useGetInspections";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/providers/auth-provider";
import { Plus } from "lucide-react";
import { ReactElement } from "react";

const InspectionsPage = () => {
  const { authUser } = useAuth();
  const { data: inspections, isLoading } = useGetInspectionsByManagerUid(authUser!.uid);

  return (
    <>
      <DashboardContentHeader title="Services">
        <InspectionDialog
          trigger={
            <Button>
              <Plus className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:block">Schedule an inspection</span>
            </Button>
          }
        />
      </DashboardContentHeader>
      <Separator />
      <section className="py-6">{isLoading ? <SkeletonTable /> : <InspectionsTable inspections={inspections} />}</section>
    </>
  );
};

InspectionsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default InspectionsPage;
