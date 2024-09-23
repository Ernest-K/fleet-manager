import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/../firebase";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";

type DeleteAssignmentOptions = {
  assignmentUid: string;
};

const deleteAssignment = async ({ assignmentUid }: DeleteAssignmentOptions) => {
  await deleteDoc(doc(db, "assignments", assignmentUid));
};

type UseDeleteAssignmentOptions = {
  managerUid: string;
};

export const useDeleteAssignment = ({ managerUid }: UseDeleteAssignmentOptions) => {
  return useMutation({
    mutationFn: (assignmentUid: DeleteAssignmentOptions["assignmentUid"]) => deleteAssignment({ assignmentUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", managerUid] });
    },
  });
};
