import type { NextApiRequest, NextApiResponse } from "next";
import { Vehicle } from "@/features/vehicles/types";
import { getDocumentsByUid } from "@/lib/helpers";
import { sendEmailReminder } from "@/lib/emailReminder";

import { CollectionNames } from "@/types";
import { User } from "@/features/auth/types";
import { fetchUpcomingVehicles, REMINDER_INTERVALS } from "@/lib/utils";
import InsurancePolicyEmailTemplate from "@/features/vehicles/components/insurance-policy-email-template";

export const sendInsuranceReminder = async (vehicle: Vehicle, daysUntil: number) => {
  const subject = daysUntil === 1 ? "Insurance Policy Expires Tomorrow" : `Insurance Policy Expires in ${daysUntil} Days`;
  const [manager] = await getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: [vehicle.managerUid] });

  await sendEmailReminder({
    to: manager.email,
    subject,
    template: <InsurancePolicyEmailTemplate vehicle={vehicle} />,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    for (const { days, range } of REMINDER_INTERVALS) {
      const vehiclesForInsurance = await fetchUpcomingVehicles("insurancePolicyDate", days, range);
      await Promise.all(vehiclesForInsurance.map((vehicle) => sendInsuranceReminder(vehicle, days)));
    }

    res.status(200).json({ message: "Notification process completed." });
  } catch (error) {
    console.error("Error in notification process:", error);
    res.status(500).json({ error: "Failed to send reminders." });
  }
}
