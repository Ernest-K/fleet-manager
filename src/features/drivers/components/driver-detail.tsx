import React from "react";
import Image from "next/image";
import { ChevronsLeftRightEllipsis, CircleDot, IdCard, LucideIcon, Mail, Phone, UserRound } from "lucide-react";

import { useGetDriver } from "@/features/drivers/hooks/useGetDriver";
import { Separator } from "@/components/ui/separator";

type DriverDetailProps = {
  driverUid: string;
};

function DriverDetail({ driverUid }: DriverDetailProps) {
  const validDriverUid = !driverUid || Array.isArray(driverUid) ? "" : driverUid;

  const { data, isLoading } = useGetDriver({ driverUid: validDriverUid });

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (!validDriverUid || !data) {
    return <p>Invalid driver uid</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-evenly gap-3 lg:gap-16 border-[1px] border-border p-6 rounded-lg flex-wrap">
      <Image src={data.photoURL ? data.photoURL : "/default-profile-photo.jpg"} alt="Profile Photo" width={200} height={200} className="rounded-full aspect-square object-cover ml-8 sm:ml-0 sm:self-center" />
      <div className="flex flex-col justify-evenly gap-3">
        <DetailRow Icon={ChevronsLeftRightEllipsis} label="UID" value={driverUid as string} />
        <div className="flex gap-6 items-center">
          <DetailRow Icon={UserRound} label="First name" value={data.firstName} />
          <DetailRow label="Last name" value={data.lastName} />
        </div>
        <DetailRow Icon={CircleDot} label="Status" value="Active" />
      </div>
      <Separator orientation="vertical" role="decorative" className="hidden xl:block xl:h-48" />
      <div className="flex flex-col md:justify-evenly gap-3">
        <DetailRow Icon={Mail} label="Email" value={data.email} />
        <DetailRow Icon={Phone} label="Phone" value={data.phone} />
        <DetailRow Icon={IdCard} label="Driver's License Number" value={data.licenseNumber} />
      </div>
    </div>
  );
}

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

export default DriverDetail;
