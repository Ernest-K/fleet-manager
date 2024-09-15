import DashboardContentHeader from "@/components/dashboard-content-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VehicleTable from "@/features/vehicles/components/vehicles-table";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

const VehiclesPage = () => {
  return (
    <>
      <DashboardContentHeader title="Vehicles">
        <Button asChild>
          <Link href={"/dashboard/vehicles/create"}>
            <Plus className="mr-2 h-5 w-5" />
            Add vehicle
          </Link>
        </Button>
      </DashboardContentHeader>
      <Separator />
      <section className="py-6">
        <VehicleTable />
      </section>
    </>
  );
};

VehiclesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VehiclesPage;
