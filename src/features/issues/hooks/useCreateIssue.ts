import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { IssueFormData } from "@/features/issues/types";
import { CreateDocOptions, createDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseCreateIssueOptions = {
  userUid: string;
  managerUid: string;
};

export function useCreateIssue({ userUid, managerUid }: UseCreateIssueOptions) {
  return useMutation({
    mutationFn: (issueData: CreateDocOptions<IssueFormData>["data"]) => createDocument<IssueFormData>({ collectionName: CollectionNames.Issues, data: issueData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Issues, userUid] });
    },
  });
}
