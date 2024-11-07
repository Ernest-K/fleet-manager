import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { DeleteDocOptions, deleteDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

const deleteDriverAuth = async ({ userUid }: { userUid: string }) => {
  const response = await fetch(`/api/deleteDriver?userUid=${userUid}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

const deleteDriver = async ({ userUid }: { userUid: string }) => {
  const response = await deleteDriverAuth({ userUid });
  await deleteDocument({ collectionName: CollectionNames.Users, docUid: userUid });

  return response;
};

type UseDeleteDriverOptions = {
  userUid: string;
};

export const useDeleteDriver = ({ userUid }: UseDeleteDriverOptions) => {
  return useMutation({
    mutationFn: (driverUid: DeleteDocOptions["docUid"]) => deleteDriver({ userUid: driverUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers", userUid] });
    },
  });
};
