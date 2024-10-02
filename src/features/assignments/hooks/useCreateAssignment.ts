import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { CreateAssignmentFormData } from "@/features/assignments/types";
import { CreateDocOptions, createDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseCreateAssignmentOptions = {
  managerUid: string;
};

export function useCreateAssignment({ managerUid }: UseCreateAssignmentOptions) {
  return useMutation({
    mutationFn: (assignmentData: CreateDocOptions<CreateAssignmentFormData>["data"]) => createDocument<CreateAssignmentFormData>({ collectionName: CollectionNames.Assignments, data: assignmentData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Assignments, managerUid] });
    },
  });
}
