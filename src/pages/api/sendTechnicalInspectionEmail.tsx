import TechnicalInspectionEmailTemplate from "@/features/vehicles/components/technical-inspection-email-template";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { db } from "../../../firebase";
import { Vehicle } from "@/features/vehicles/types";
import { getDocumentsByUid } from "@/lib/helpers";
import { CollectionNames } from "@/types";
import { User } from "@/features/auth/types";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendInspectionReminder = async (vehicle: Vehicle, daysUntilInspection: number) => {
  try {
    const subject = daysUntilInspection === 1 ? "Upcoming Vehicle Inspection Tomorrow" : `Upcoming Vehicle Inspection in ${daysUntilInspection} Days`;
    const [manager] = await getDocumentsByUid<User>({ collectionName: CollectionNames.Users, uids: [vehicle.managerUid] });
    await resend.emails.send({
      from: "onboarding@resend.dev",
      //   to: manager.email,
      to: "264019@student.pwr.edu.pl",
      subject: subject,
      react: <TechnicalInspectionEmailTemplate vehicle={vehicle} />,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const today = new Date();
    const intervals = [
      { days: 30, range: 1 },
      { days: 7, range: 1 },
      { days: 1, range: 1 },
    ];
    const vehicleRef = collection(db, "vehicles");

    for (const { days, range } of intervals) {
      const startDate = new Date(today.getTime() + (days - range) * 24 * 60 * 60 * 1000);
      const endDate = new Date(today.getTime() + (days + range) * 24 * 60 * 60 * 1000);

      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      // Query vehicles with inspection dates within the specified range
      const upcomingInspectionsQuery = query(
        vehicleRef,
        where("technicalInspectionDate", ">=", startTimestamp),
        where("technicalInspectionDate", "<=", endTimestamp)
      );
      const snapshot = await getDocs(upcomingInspectionsQuery);

      if (!snapshot.empty) {
        const vehiclesToNotify = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Vehicle));
        console.log(vehiclesToNotify);
        await Promise.all(vehiclesToNotify.map((vehicle) => sendInspectionReminder(vehicle, days)));
      }
    }

    res.status(200).json({ message: "Notification process completed." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
