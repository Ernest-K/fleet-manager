import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { createDriverFormSchema } from "@/features/drivers/types";
import queryClient from "@/lib/queryClient";

type createDriverOptions = {
  driverData: z.infer<typeof createDriverFormSchema>;
  managerUid: string;
};

async function createDriver({ driverData, managerUid }: createDriverOptions) {
  const response = await fetch("/api/createDriver", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...driverData, managerUid: managerUid }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

type useCreateDriverOptions = {
  managerUid: string;
};

export function useCreateDriver({ managerUid }: useCreateDriverOptions) {
  return useMutation({
    mutationFn: (driverData: createDriverOptions["driverData"]) => createDriver({ driverData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers", managerUid] });
    },
  });
}
