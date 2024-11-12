import TechnicalInspectionEmailTemplate from "@/features/vehicles/components/technical-inspection-email-template";
import type { NextApiRequest, NextApiResponse } from "next";
import { Vehicle } from "@/features/vehicles/types";
import { getDocumentsByUid } from "@/lib/helpers";
import { sendEmailReminder } from "@/lib/emailReminder";

import { CollectionNames } from "@/types";
import { User } from "@/features/auth/types";
import { fetchUpcomingVehicles, REMINDER_INTERVALS } from "@/lib/utils";

export const sendInspectionReminder = async (vehicle: Vehicle, daysUntil: number) => {
  const subject = daysUntil === 1 ? "Upcoming Vehicle Inspection Tomorrow" : `Upcoming Vehicle Inspection in ${daysUntil} Days`;
  const [manager] = await getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: [vehicle.managerUid] });

  await sendEmailReminder({
    to: manager.email,
    subject,
    template: <TechnicalInspectionEmailTemplate vehicle={vehicle} />,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    for (const { days, range } of REMINDER_INTERVALS) {
      const vehiclesForInspection = await fetchUpcomingVehicles("technicalInspectionDate", days, range);
      await Promise.all(vehiclesForInspection.map((vehicle) => sendInspectionReminder(vehicle, days)));
    }

    res.status(200).json({ message: "Notification process completed." });
  } catch (error) {
    console.error("Error in notification process:", error);
    res.status(500).json({ error: "Failed to send reminders." });
  }
}
