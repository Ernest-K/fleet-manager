import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { InspectionFormData } from "@/features/inspections/types";
import { UpdateDocOptions, updateDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseUpdateInspectionOptions = {
  userUid: string;
};

type UpdateInspectionOptions = {
  inspectionUid: UpdateDocOptions<InspectionFormData>["docUid"];
  inspectionData: UpdateDocOptions<InspectionFormData>["data"];
};

export function useUpdateInspection({ userUid }: UseUpdateInspectionOptions) {
  return useMutation({
    mutationFn: ({ inspectionUid, inspectionData }: UpdateInspectionOptions) => updateDocument<InspectionFormData>({ collectionName: CollectionNames.Inspections, docUid: inspectionUid, data: inspectionData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Inspections, userUid] });
    },
  });
}
