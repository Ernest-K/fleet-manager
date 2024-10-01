import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDriversByUid } from "@/features/drivers/hooks/useGetDrivers";
import { getVehiclesByUid } from "@/features/vehicles/hooks/useGetVehicles";
import { db } from "@/../firebase";
import { Issue } from "@/features/issues/types";
import { getDocumentsByManagerUid, getDocumentsByUid } from "@/lib/helpers";
import { CollectionNames } from "@/types";
import { User } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";

// type GetIssuesOptions = {
//   managerUid: string;
//   driverUid?: string;
// };

// export const getIssues = async ({ managerUid, driverUid }: GetIssuesOptions): Promise<Issue[]> => {
//   const issuesRef = collection(db, "issues");
//   let issuesQuery;

//   if (driverUid) {
//     issuesQuery = query(issuesRef, where("reportedBy", "==", driverUid));
//   } else if (managerUid) {
//     issuesQuery = query(issuesRef, where("managerUid", "==", managerUid));
//   } else {
//     throw new Error("ManagerUID or DriverUID not specified");
//   }

//   const issuesSnapshot = await getDocs(issuesQuery);
//   return issuesSnapshot.docs.map((doc) => ({
//     uid: doc.id,
//     ...doc.data(),
//   })) as Issue[];
// };

// type UseGetIssuesOptions = {
//   managerUid: string;
//   driverUid?: string;
// };

// export const useGetIssues = ({ managerUid, driverUid }: UseGetIssuesOptions) => {
//   const queryResult = useQuery({
//     queryFn: async () => {
//       const issues = await getIssues({ managerUid, driverUid });

//       const driverUids = Array.from(new Set(issues.map((issue) => issue.reportedBy)));
//       const vehicleUids = Array.from(new Set(issues.map((issue) => issue.vehicleUid)));

//       const [drivers, vehicles] = await Promise.all([getDriversByUid({ driverUids }), getVehiclesByUid({ vehicleUids })]);

//       const issuesWithDetails = issues.map((issue) => ({
//         ...issue,
//         reportedByUser: drivers.find((driver) => driver.uid === issue.reportedBy),
//         vehicle: vehicles.find((vehicle) => vehicle.uid === issue.vehicleUid),
//       }));

//       return issuesWithDetails;
//     },
//     queryKey: ["issues", managerUid, driverUid],
//     enabled: !!managerUid, // Ensure the query only runs if managerUid exists
//   });

//   return {
//     ...queryResult,
//     isLoading: queryResult.isLoading,
//     isError: queryResult.isError,
//   };
// };

export const useGetIssuesByManagerUid = (managerUid: string) => {
  const queryResult = useQuery({
    queryFn: async () => {
      const issues = await getDocumentsByManagerUid<Issue>({ collectionName: CollectionNames.Issues, managerUid });

      const usersUids = Array.from(new Set(issues.map((issue) => issue.createdBy)));
      const vehicleUids = Array.from(new Set(issues.map((issue) => issue.vehicleUid)));

      const [users, vehicles] = await Promise.all([getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: usersUids }), getDocumentsByUid<Vehicle>({ collectionName: CollectionNames.Vehicles, uids: vehicleUids })]);

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
