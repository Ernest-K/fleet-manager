import { doc, updateDoc } from "firebase/firestore";
import { Driver } from "@/features/drivers/types";
import { db } from "@/../firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type UpdateDriverOptions = {
  driverUid: string;
  data: Partial<Driver>;
};

const updateDriver = async ({ driverUid, data }: UpdateDriverOptions) => {
  const driverDocRef = doc(db, "users", driverUid);
  return await updateDoc(driverDocRef, data);
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDriver,
    onSuccess: (_, { driverUid }) => {
      queryClient.invalidateQueries({ queryKey: ["driver", driverUid] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    },
  });
};
