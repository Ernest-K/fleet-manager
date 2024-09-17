import React from "react";
import { Barcode, Calendar, CalendarCheck, Car, ChevronsLeftRightEllipsis, CircleDot, FileDigit, Fuel, Gauge, LucideIcon, Notebook, Palette } from "lucide-react";
import { format } from "date-fns";
import { Vehicle } from "@/features/vehicles/types";

type VehicleDetailProps = {
  vehicle: Vehicle;
};

function VehicleDetail({ vehicle }: VehicleDetailProps) {
  return (
    <div className="max-w-xl flex flex-col gap-3 border-[1px] border-border p-6 rounded-lg">
      <DetailRow Icon={ChevronsLeftRightEllipsis} label="UID" value={vehicle.uid} />
      <div className="flex flex-col sm:flex-row gap-6 ">
        <DetailRow Icon={Car} label="Type" value={vehicle.vehicleType} />
        <div className="flex gap-6 ml-10 sm:ml-0">
          <DetailRow label="Make" value={vehicle.make} />
          <DetailRow label="Model" value={vehicle.model} />
        </div>
      </div>
      <DetailRow Icon={CircleDot} label="Status" value={vehicle.status} />
      <DetailRow Icon={Calendar} label="Year" value={vehicle.year} />
      <DetailRow Icon={Palette} label="Color" value={vehicle.color} />
      <DetailRow Icon={Barcode} label="VIN" value={vehicle.vin} />
      <DetailRow Icon={Fuel} label="Fuel Type" value={vehicle.fuelType} />
      <DetailRow Icon={Gauge} label="Odometer Reading" value={vehicle.odometerReading.toString()} />
      <div className="flex gap-3 sm:gap-6">
        <DetailRow Icon={FileDigit} label="License Plate Number" value={vehicle.licensePlateNumber} />
        <DetailRow label="Registration" value={vehicle.registration} />
      </div>
      <div className="flex gap-3 sm:gap-6">
        <DetailRow Icon={CalendarCheck} label="Technical Inspection" value={format(vehicle.technicalInspectionDate.toDate(), "P")} />
        <DetailRow label="Insurance Policy" value={format(vehicle.insurancePolicyDate.toDate(), "P")} />
      </div>
      {vehicle.notes && <DetailRow Icon={Notebook} label="Notes" value={vehicle.notes} />}
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
      <p className="text-sm text-muted-foreground capitalize">{label}</p>
      {value ? <p className="md:text-lg">{value}</p> : <p className="md:text-lg">n/a</p>}
    </div>
  </div>
);

export default VehicleDetail;
