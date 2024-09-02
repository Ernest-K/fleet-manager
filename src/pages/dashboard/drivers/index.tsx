import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DriverTable from "@/features/drivers/components/drivers-table";
import { useGetDrivers } from "@/features/drivers/hooks/useGetDrivers";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/providers/auth-provider";
import { UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

const DriversPage = () => {
  return (
    <>
      <header className="w-full flex justify-between items-center pb-3">
        <h2 className="text-2xl font-medium">Drivers</h2>
        <Button asChild>
          <Link href={"/dashboard/drivers/create"}>
            <UserRoundPlus className="mr-2 h-5 w-5" />
            Create driver
          </Link>
        </Button>
      </header>
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
