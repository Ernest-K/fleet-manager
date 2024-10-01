import { useQuery } from "@tanstack/react-query";
import { Service } from "../types";
import { getDocumentsByManagerUid, getDocumentsByUid } from "@/lib/helpers";
import { CollectionNames } from "@/types";
import { User } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";

export const useGetServicesByManagerUid = (managerUid: string) => {
  const queryResult = useQuery({
    queryFn: async () => {
      const services = await getDocumentsByManagerUid<Service>({ collectionName: CollectionNames.Services, managerUid });

      const usersUids = Array.from(new Set(services.map((service) => service.createdBy)));
      const vehicleUids = Array.from(new Set(services.map((service) => service.vehicleUid)));

      const [users, vehicles] = await Promise.all([getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: usersUids }), getDocumentsByUid<Vehicle>({ collectionName: CollectionNames.Vehicles, uids: vehicleUids })]);

      const servicesWithDetails = services.map((service) => ({
        ...service,
        createdByUser: users.find((user) => user.uid === service.createdBy),
        vehicle: vehicles.find((vehicle) => vehicle.uid === service.vehicleUid),
      }));

      return servicesWithDetails;
    },
    queryKey: [CollectionNames.Services, managerUid],
    enabled: !!managerUid,
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
};