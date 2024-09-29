import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import queryClient from "@/lib/queryClient";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/../firebase";
import { createIssueFormSchema } from "@/features/issues/types";

type CreateIssueOptions = {
  issueData: z.infer<typeof createIssueFormSchema> & { reportedBy: string; reportedAt: Date };
  managerUid: string;
};

async function createIssue({ issueData, managerUid }: CreateIssueOptions) {
  await addDoc(collection(db, "issues"), {
    ...issueData,
    managerUid: managerUid,
  });
}

type UseCreateIssueOptions = {
  managerUid: string;
};

export function useCreateIssue({ managerUid }: UseCreateIssueOptions) {
  return useMutation({
    mutationFn: (issueData: CreateIssueOptions["issueData"]) => createIssue({ issueData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", managerUid] });
    },
  });
}
