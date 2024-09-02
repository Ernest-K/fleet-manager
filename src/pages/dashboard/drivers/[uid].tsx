import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { ArrowLeft } from "lucide-react";
import BackButton from "@/components/back-button";

const DriverDetailPage = () => {
  const router = useRouter();
  const { uid } = router.query;

  return (
    <>
      <header className="w-full flex justify-start items-center gap-6">
        <BackButton />
        <h2 className="text-2xl font-medium">Driver details</h2>
      </header>
      <section className="py-5 max-w-xl flex flex-col gap-5">
        <p>{uid}</p>
      </section>
    </>
  );
};

DriverDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DriverDetailPage;
