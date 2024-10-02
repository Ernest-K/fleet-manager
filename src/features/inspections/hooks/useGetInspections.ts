import { useQuery } from "@tanstack/react-query";
import { getDocumentsByManagerUid, getDocumentsByUid } from "@/lib/helpers";
import { CollectionNames } from "@/types";
import { User } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";
import { Inspection } from "@/features/inspections/types";

export const useGetInspectionsByManagerUid = (managerUid: string) => {
  const queryResult = useQuery({
    queryFn: async () => {
      const inspections = await getDocumentsByManagerUid<Inspection>({ collectionName: CollectionNames.Inspections, managerUid });

      const usersUids = Array.from(new Set(inspections.map((inspection) => inspection.createdBy)));
      const vehicleUids = Array.from(new Set(inspections.map((inspection) => inspection.vehicleUid)));

      const [users, vehicles] = await Promise.all([getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: usersUids }), getDocumentsByUid<Vehicle>({ collectionName: CollectionNames.Vehicles, uids: vehicleUids })]);

      const inspectionsWithDetails = inspections.map((inspection) => ({
        ...inspection,
        createdByUser: users.find((user) => user.uid === inspection.createdBy),
        vehicle: vehicles.find((vehicle) => vehicle.uid === inspection.vehicleUid),
      }));

      return inspectionsWithDetails;
    },
    queryKey: [CollectionNames.Inspections, managerUid],
    enabled: !!managerUid,
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
};
