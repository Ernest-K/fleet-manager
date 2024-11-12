import { NextApiRequest, NextApiResponse } from "next";
import { Timestamp } from "firebase-admin/firestore";
import { Assignment } from "@/features/assignments/types";
import { Driver } from "@/features/drivers/types";
import { Vehicle } from "@/features/vehicles/types";
import admin from "@/../firebaseAdmin";

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const now = Timestamp.now();

    const assignmentsSnapshot = await db.collection("assignments").get();

    assignmentsSnapshot.forEach(async (doc) => {
      const assignment = doc.data() as Assignment;
      const { driverUid, vehicleUid, dateRange } = assignment;

      const isActiveAssignment = dateRange.from <= now && dateRange.to >= now;

      const driverRef = db.collection("users").doc(driverUid);
      const driverDoc = await driverRef.get();
      if (driverDoc.exists) {
        const driver = driverDoc.data() as Driver;
        if (isActiveAssignment) {
          if (driver.status !== "on trip") {
            await driverRef.update({ status: "on trip" });
          }
        } else if (driver.status === "on trip") {
          await driverRef.update({ status: "active" });
        }
      }

      const vehicleRef = db.collection("vehicles").doc(vehicleUid);
      const vehicleDoc = await vehicleRef.get();
      if (vehicleDoc.exists) {
        const vehicle = vehicleDoc.data() as Vehicle;
        if (isActiveAssignment) {
          if (vehicle.status !== "on trip") {
            await vehicleRef.update({ status: "on trip" });
          }
        } else if (vehicle.status === "on trip") {
          await vehicleRef.update({ status: "active" });
        }
      }
    });

    res.status(200).json({ message: "Statuses updated successfully" });
  } catch (error) {
    console.error("Error updating statuses:", error);
    res.status(500).json({ error: "Failed to update statuses" });
  }
}
