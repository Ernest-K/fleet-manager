import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import queryClient from "@/lib/queryClient";
import { createAssignmentFormSchema } from "@/features/assignments/types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/../firebase";

type createAssignmentOptions = {
  assignmentData: z.infer<typeof createAssignmentFormSchema>;
  managerUid: string;
};

async function createAssignment({ assignmentData, managerUid }: createAssignmentOptions) {
  await addDoc(collection(db, "assignments"), {
    ...assignmentData,
    createdBy: managerUid,
  });
}

type useCreateAssignmentOptions = {
  managerUid: string;
};

export function useCreateAssignment({ managerUid }: useCreateAssignmentOptions) {
  return useMutation({
    mutationFn: (assignmentData: createAssignmentOptions["assignmentData"]) => createAssignment({ assignmentData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", managerUid] });
    },
  });
}
