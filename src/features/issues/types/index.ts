import { User } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";
import { VehicleEvent } from "@/types";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const Severity = z.enum(["low", "medium", "high"]);
export const SeverityColors = { low: "bg-green-500", medium: "bg-yellow-400", high: "bg-red-600" };
export const IssueStatus = z.enum(["open", "in progress", "resolved", "closed"]);
export const IssueType = z.enum(["mechanical", "electrical", "safety", "other"]);

export const issueFormSchema = z.object({
  vehicleUid: z.string(),
  type: IssueType,
  description: z.string().optional(),
  severity: Severity,
  status: IssueStatus,
});

export type IssueFormData = z.infer<typeof issueFormSchema>;

// export type Issue = z.infer<typeof createIssueFormSchema> & {
//   uid: string;
//   reportedBy: string;
//   reportedByUser?: User;
//   reportedAt: Timestamp;
//   vehicle?: Vehicle;
//   managerUid: string;
// };

export type Issue = VehicleEvent & {
  type: z.infer<typeof IssueType>;
  status: z.infer<typeof IssueStatus>;
  severity: z.infer<typeof Severity>;
  description?: string;
  managerUid: string;
};
