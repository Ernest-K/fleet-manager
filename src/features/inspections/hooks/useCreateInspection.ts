import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { InspectionFormData } from "@/features/inspections/types";
import { CreateDocOptions, createDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseCreateInspectionOptions = {
  userUid: string;
  managerUid: string;
};

export function useCreateInspection({ userUid, managerUid }: UseCreateInspectionOptions) {
  return useMutation({
    mutationFn: (inspectionData: CreateDocOptions<InspectionFormData>["data"]) => createDocument<InspectionFormData>({ collectionName: CollectionNames.Inspections, data: inspectionData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Inspections, userUid] });
    },
  });
}
