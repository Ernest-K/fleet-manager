import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { ArrowLeft, LucideIcon, Phone } from "lucide-react";
import BackButton from "@/components/back-button";
import { UserRound, Mail, CircleDot, IdCard, ChevronsLeftRightEllipsis } from "lucide-react";
import { useGetDriver } from "@/features/drivers/hooks/useGetDriver";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const DriverDetailPage = () => {
  const router = useRouter();
  const { uid: driverUid } = router.query;

  const validDriverUid = !driverUid || Array.isArray(driverUid) ? "" : driverUid;

  const { data, isLoading } = useGetDriver({ driverUid: validDriverUid });

  if (!validDriverUid || !data) {
    return <p>Invalid driver uid</p>;
  }

  return (
    <>
      <header className="w-full flex justify-start items-center gap-6">
        <BackButton />
        <h2 className="text-2xl font-medium">Driver details</h2>
      </header>
      <section className="py-5 flex flex-col items-stretch">
        <div className="flex flex-col md:items-center md:flex-row flex- justify-evenly gap-4 md:gap-16 border-[1px] border-border p-6 rounded-lg flex-wrap">
          <Image src={data.photoURL ? data.photoURL : "/default-profile-photo.jpg"} alt="Profile Photo" width={200} height={200} className="rounded-full aspect-square object-cover self-center" />
          <div className="flex flex-col justify-evenly gap-4">
            <DetailRow Icon={ChevronsLeftRightEllipsis} label="UID" value={driverUid as string} />
            <div className="flex gap-6 items-center">
              <DetailRow Icon={UserRound} label="First name" value={data.firstName} />
              <DetailRow label="Last name" value={data.lastName} />
            </div>
            <DetailRow Icon={CircleDot} label="Status" value="Active" />
          </div>

          <Separator orientation="vertical" className="hidden md:block md:h-48" />

          <div className="flex flex-col md:justify-evenly gap-4">
            <DetailRow Icon={Mail} label="Email" value={data.email} />
            <DetailRow Icon={Phone} label="Phone" value={data.phone} />
            <DetailRow Icon={IdCard} label="Driver's License Number" value={data.licenseNumber} />
          </div>
        </div>
      </section>
    </>
  );
};

type DetailRowProps = {
  Icon?: LucideIcon;
  label: string;
  value?: string;
};

const DetailRow = ({ Icon, label, value }: DetailRowProps) => (
  <div className="flex gap-6 items-center">
    {Icon && <Icon className="w-4 h-4 md:w-6 md:h-6 text-muted-foreground flex-shrink-0" />}
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {value ? <p className="md:text-lg">{value}</p> : <p className="md:text-lg">n/a</p>}
    </div>
  </div>
);

DriverDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DriverDetailPage;
