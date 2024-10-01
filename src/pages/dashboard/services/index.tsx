import DashboardContentHeader from "@/components/dashboard-content-header";
import SkeletonTable from "@/components/skeleton-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ServiceDialog from "@/features/services/components/service-dialog";
import ServicesTable from "@/features/services/components/services-table";
import { useGetServicesByManagerUid } from "@/features/services/hooks/useGetServices";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/providers/auth-provider";
import { Plus } from "lucide-react";
import { ReactElement } from "react";

const ServicesPage = () => {
  const { authUser } = useAuth();
  const { data: services, isLoading } = useGetServicesByManagerUid(authUser!.uid);

  return (
    <>
      <DashboardContentHeader title="Services">
        <ServiceDialog
          trigger={
            <Button>
              <Plus className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:block">Schedule a service</span>
            </Button>
          }
        />
      </DashboardContentHeader>
      <Separator />
      <section className="py-6">{isLoading ? <SkeletonTable /> : <ServicesTable services={services} />}</section>
    </>
  );
};

ServicesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ServicesPage;
