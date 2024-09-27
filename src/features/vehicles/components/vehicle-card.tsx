import DetailRow from "@/components/detail-row";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/features/vehicles/types";
import { Barcode, CalendarIcon, Car, ChevronsLeftRightEllipsis, CircleDot, FileDigit, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

type VehicleCardProps = {
  vehicle: Vehicle;
};

const VehicleCard = ({ vehicle }: VehicleCardProps) => (
  <div className="border-border border-[1px] rounded-lg p-6 flex flex-col justify-center gap-3 relative grow">
    <Button asChild variant="ghost" size="icon" className="absolute top-6 right-6">
      <Link href={`/dashboard/vehicles/${vehicle.uid}`} target="_blank">
        <SquareArrowOutUpRight className="w-4 h-4" />
      </Link>
    </Button>
    <div className="flex flex-col justify-evenly gap-3">
      <DetailRow Icon={ChevronsLeftRightEllipsis} label="UID" value={vehicle.uid} />
      <div className="flex flex-col sm:flex-row gap-3 ">
        <DetailRow Icon={Car} label="Type" value={vehicle.vehicleType} />
        <div className="flex gap-3 ml-10 sm:ml-0">
          <DetailRow label="Make" value={vehicle.make} />
          <DetailRow label="Model" value={vehicle.model} />
        </div>
      </div>
      <DetailRow Icon={CircleDot} label="Status" value={vehicle.status} />
      <DetailRow Icon={CalendarIcon} label="Year" value={vehicle.year} />
      <DetailRow Icon={FileDigit} label="License Plate Number" value={vehicle.licensePlateNumber} />
      <DetailRow Icon={Barcode} label="VIN" value={vehicle.vin} />
    </div>
  </div>
);

export default VehicleCard;
