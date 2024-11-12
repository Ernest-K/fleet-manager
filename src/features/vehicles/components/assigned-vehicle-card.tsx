import DetailRow from "@/components/detail-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentList from "@/features/documents/components/document-list";
import IssueDialog from "@/features/issues/components/issue-dialog";
import { Vehicle } from "@/features/vehicles/types";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { Barcode, CalendarIcon, Car, ChevronsLeftRightEllipsis, CircleDot, FileDigit, TriangleAlert } from "lucide-react";
import Image from "next/image";

type AssignedVehicleCardProps = {
  vehicle: Vehicle;
  from: Timestamp;
  to: Timestamp;
};

const AssignedVehicleCard = ({ vehicle, from, to }: AssignedVehicleCardProps) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <CardTitle>Assigned vehicle</CardTitle>
          <CardDescription>{`from ${format(from.toDate(), "PP")} to ${format(to.toDate(), "PP")}`}</CardDescription>
        </div>
        <IssueDialog
          vehicleUid={vehicle.uid}
          trigger={
            <Button>
              <TriangleAlert className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:block">Report an issue</span>
            </Button>
          }
        />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex flex-col justify-evenly gap-3">
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
        <div className="flex-1 flex gap-3 flex-col">
          {vehicle.photosURL && (
            <>
              <h2 className="text-xl font-medium">Photos</h2>
              <div className="grid grid-cols-3 gap-4">
                {vehicle.photosURL.map((url, index) => (
                  <div key={index} className="aspect-square">
                    <Image src={url} alt={`Photo ${index + 1}`} width={500} height={500} className="w-full h-full object-cover rounded-md" />
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="text-xl font-medium">Documents</h2>
          <DocumentList entityUid={vehicle.uid} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AssignedVehicleCard;
