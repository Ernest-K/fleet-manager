import { Button } from "@/components/ui/button";
import { useGetDrivers } from "@/features/drivers/hooks/useGetDrivers";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/providers/auth-provider";
import { UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

const DriversPage = () => {
  const { authUser } = useAuth();

  const { data, isLoading } = useGetDrivers({ managerUid: authUser!.uid });

  console.log(data);

  return (
    <>
      <header className="w-full flex justify-between">
        <h2 className="text-2xl font-medium">Drivers</h2>
        <Button asChild>
          <Link href={"/dashboard/drivers/create"}>
            <UserRoundPlus className="mr-2 h-5 w-5" />
            Create driver
          </Link>
        </Button>
      </header>
    </>
  );
};

DriversPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DriversPage;
