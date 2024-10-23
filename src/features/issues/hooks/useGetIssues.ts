import { useQuery } from "@tanstack/react-query";
import { Issue } from "@/features/issues/types";
import { getDocumentsByManagerUid, getDocumentsByUid, getDocumentsByVehicleUid } from "@/lib/helpers";
import { CollectionNames } from "@/types";
import { User } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";

export const useGetIssuesByVehicleUid = (vehicleUid: string) => {
  const queryResult = useQuery({
    queryFn: async () => {
      const issues = await getDocumentsByVehicleUid<Issue>({ collectionName: CollectionNames.Issues, vehicleUid });

      const usersUids = Array.from(new Set(issues.map((issue) => issue.createdBy)));
      const users = await getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: usersUids });
      const [vehicle] = await getDocumentsByUid<Vehicle>({ collectionName: CollectionNames.Vehicles, uids: [vehicleUid] });

      const issuesWithDetails = issues.map((issue) => ({
        ...issue,
        createdByUser: users.find((user) => user.uid === issue.createdBy),
        vehicle: vehicle,
      }));

      return issuesWithDetails;
    },
    queryKey: [CollectionNames.Issues, vehicleUid],
    enabled: !!vehicleUid,
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
};

//TODO - dodać userUid jako parametr aby odświeżać
export const useGetIssuesByManagerUid = (managerUid: string) => {
  const queryResult = useQuery({
    queryFn: async () => {
      const issues = await getDocumentsByManagerUid<Issue>({ collectionName: CollectionNames.Issues, managerUid });

      const usersUids = Array.from(new Set(issues.map((issue) => issue.createdBy)));
      const vehicleUids = Array.from(new Set(issues.map((issue) => issue.vehicleUid)));

      const [users, vehicles] = await Promise.all([
        getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: usersUids }),
        getDocumentsByUid<Vehicle>({ collectionName: CollectionNames.Vehicles, uids: vehicleUids }),
      ]);

      const issuesWithDetails = issues.map((issue) => ({
        ...issue,
        createdByUser: users.find((user) => user.uid === issue.createdBy),
        vehicle: vehicles.find((vehicle) => vehicle.uid === issue.vehicleUid),
      }));

      return issuesWithDetails;
    },
    queryKey: [CollectionNames.Issues, managerUid],
    enabled: !!managerUid,
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
};
