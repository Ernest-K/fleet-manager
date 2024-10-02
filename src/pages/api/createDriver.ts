import { NextApiRequest, NextApiResponse } from "next";
import admin from "@/../firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { firstName, lastName, phone, licenseNumber, status, email, password, managerUid } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin
      .firestore()
      .collection("users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        firstName,
        lastName,
        phone: phone ?? "",
        licenseNumber: licenseNumber ?? "",
        status,
        email,
        role: "driver",
        managerUid,
      });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error creating driver");
    res.status(500).json({ error: "Error creating driver" });
  }
}
