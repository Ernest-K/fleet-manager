import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/../firebase";
import { Assignment } from "@/features/assignments/types";
import { CollectionNames } from "@/types";
import { getDocumentsByUid } from "@/lib/helpers";
import { User } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";

type UseGetAssignmentsOptions = {
  managerUid: string;
  driverUid?: string;
  vehicleUid?: string;
};

export const useGetAssignments = ({ managerUid, driverUid, vehicleUid }: UseGetAssignmentsOptions) => {
  const queryResult = useQuery({
    queryFn: async () => {
      const assignmentsRef = collection(db, CollectionNames.Assignments);
      let assignmentsQuery;

      if (driverUid) {
        assignmentsQuery = query(assignmentsRef, where("driverUid", "==", driverUid));
      } else if (vehicleUid) {
        assignmentsQuery = query(assignmentsRef, where("vehicleUid", "==", vehicleUid));
      } else {
        assignmentsQuery = query(assignmentsRef, where("managerUid", "==", managerUid));
      }

      const querySnapshot = await getDocs(assignmentsQuery);

      const assignments = querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Assignment));
      const usersUids = Array.from(new Set(assignments.map((assignment) => assignment.driverUid)));
      const vehicleUids = Array.from(new Set(assignments.map((assignment) => assignment.vehicleUid)));

      const [users, vehicles] = await Promise.all([getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: usersUids }), getDocumentsByUid<Vehicle>({ collectionName: CollectionNames.Vehicles, uids: vehicleUids })]);

      const assignmentsWithDetails = assignments.map((assignment) => ({
        ...assignment,
        driver: users.find((user) => user.uid === assignment.driverUid),
        vehicle: vehicles.find((vehicle) => vehicle.uid === assignment.vehicleUid),
      }));

      return assignmentsWithDetails;
    },
    queryKey: [CollectionNames.Assignments, managerUid, driverUid, vehicleUid],
    enabled: !!managerUid,
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
};
