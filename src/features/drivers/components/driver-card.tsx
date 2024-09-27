import { Button } from "@/components/ui/button";
import { ChevronsLeftRightEllipsis, CircleDot, SquareArrowOutUpRight, UserRound } from "lucide-react";
import Link from "next/link";
import { Driver } from "@/features/drivers/types";
import Image from "next/image";
import DetailRow from "@/components/detail-row";

type DriverCardProps = {
  driver: Driver;
};

const DriverCard = ({ driver }: DriverCardProps) => (
  <div className="border-border border-[1px] rounded-lg p-6 flex flex-col justify-center gap-3 relative grow">
    <Button asChild variant="ghost" size="icon" className="absolute top-6 right-6">
      <Link href={`/dashboard/drivers/${driver.uid}`} target="_blank">
        <SquareArrowOutUpRight className="w-4 h-4" />
      </Link>
    </Button>
    <Image src={driver.photoURL ? driver.photoURL : "/default-profile-photo.jpg"} alt="Profile Photo" width={150} height={150} className="rounded-full aspect-square object-cover ml-8 sm:ml-0 sm:self-center" />
    <div className="flex flex-col justify-evenly gap-3">
      <DetailRow Icon={ChevronsLeftRightEllipsis} label="UID" value={driver.uid as string} />
      <div className="flex gap-6 items-center">
        <DetailRow Icon={UserRound} label="First name" value={driver.firstName} />
        <DetailRow label="Last name" value={driver.lastName} />
      </div>
      <DetailRow Icon={CircleDot} label="Status" value={driver.status} />
    </div>
  </div>
);

export default DriverCard;
