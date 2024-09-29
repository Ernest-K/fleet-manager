import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/../firebase";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";

type DeleteIssueOptions = {
  issueUid: string;
};

const deleteIssue = async ({ issueUid }: DeleteIssueOptions) => {
  await deleteDoc(doc(db, "issues", issueUid));
};

type UseDeleteIssueOptions = {
  managerUid: string;
};

export const useDeleteIssue = ({ managerUid }: UseDeleteIssueOptions) => {
  return useMutation({
    mutationFn: (issueUid: DeleteIssueOptions["issueUid"]) => deleteIssue({ issueUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", managerUid] });
    },
  });
};
