import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { IssueFormData } from "@/features/issues/types";
import { UpdateDocOptions, updateDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseUpdateIssueOptions = {
  userUid: string;
};

type UpdateIssueOptions = {
  issueUid: UpdateDocOptions<IssueFormData>["docUid"];
  issueData: UpdateDocOptions<IssueFormData>["data"];
};

export function useUpdateIssue({ userUid }: UseUpdateIssueOptions) {
  return useMutation({
    mutationFn: ({ issueUid, issueData }: UpdateIssueOptions) => updateDocument<IssueFormData>({ collectionName: CollectionNames.Issues, docUid: issueUid, data: issueData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Issues, userUid] });
    },
  });
}
