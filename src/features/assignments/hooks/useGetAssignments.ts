import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useGetDrivers } from "@/features/drivers/hooks/useGetDrivers";
import { useGetVehicles } from "@/features/vehicles/hooks/useGetVehicles";
import { db } from "@/../firebase";
import { Assignment } from "@/features/assignments/types";

type UseGetAssignmentsOptions = {
  managerUid: string;
};

export const useGetAssignments = ({ managerUid }: UseGetAssignmentsOptions) => {
  const { data: drivers, isLoading: isLoadingDrivers, isError: isErrorDrivers } = useGetDrivers({ managerUid });
  const { data: vehicles, isLoading: isLoadingVehicles, isError: isErrorVehicles } = useGetVehicles({ managerUid });

  const queryResult = useQuery({
    queryFn: async () => {
      const assignmentsRef = collection(db, "assignments");
      const assignmentsQuery = query(assignmentsRef, where("createdBy", "==", managerUid));
      const querySnapshot = await getDocs(assignmentsQuery);

      // Step 1: Fetch all assignments
      const assignments = querySnapshot.docs.map((doc) => {
        const assignmentData = doc.data();

        // Step 2: Find driver and vehicle from the existing fetched data
        const driver = drivers?.find((driver) => driver.uid === assignmentData.driverUid);
        const vehicle = vehicles?.find((vehicle) => vehicle.uid === assignmentData.vehicleUid);

        // Step 3: Attach driver and vehicle to assignment
        return {
          uid: doc.id,
          ...assignmentData,
          driver: driver,
          vehicle: vehicle,
        } as Assignment;
      });

      return assignments;
    },
    queryKey: ["assignments", managerUid],
    enabled: !!managerUid && !isLoadingDrivers && !isLoadingVehicles && !isErrorDrivers && !isErrorVehicles, // TODO, Only fetch if drivers and vehicles are loaded and no errors
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading || isLoadingDrivers || isLoadingVehicles, // Combine loading states
    isError: queryResult.isError || isErrorDrivers || isErrorVehicles, // Combine error states
  };
};
