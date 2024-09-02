import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type deleteDriverOptions = {
  driverUid: string;
};

const deleteDriver = async ({ driverUid }: deleteDriverOptions) => {
  await deleteDoc(doc(db, "users", driverUid));
};

type useDeleteDriverOptions = {
  managerUid: string;
};

export const useDeleteDriver = ({ managerUid }: useDeleteDriverOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (driverUid: deleteDriverOptions["driverUid"]) => deleteDriver({ driverUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers", managerUid] });
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
