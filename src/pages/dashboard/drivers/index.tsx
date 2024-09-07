import DashboardContentHeader from "@/components/dashboard-content-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DriverTable from "@/features/drivers/components/drivers-table";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

const DriversPage = () => {
  return (
    <>
      <DashboardContentHeader title="Drivers">
        <Button asChild>
          <Link href={"/dashboard/drivers/create"}>
            <UserRoundPlus className="mr-2 h-5 w-5" />
            Add driver
          </Link>
        </Button>
      </DashboardContentHeader>
      <Separator />
      <section className="py-6">
        <DriverTable />
      </section>
    </>
  );
};

DriversPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DriversPage;
