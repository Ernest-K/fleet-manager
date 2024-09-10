import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";

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
  return useMutation({
    mutationFn: (driverUid: deleteDriverOptions["driverUid"]) => deleteDriver({ driverUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers", managerUid] });
    },
  });
};
