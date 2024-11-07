import { NextApiRequest, NextApiResponse } from "next";
import admin from "@/../firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userUid } = req.query;

  if (!userUid || typeof userUid !== "string") {
    return res.status(400).json({ error: "Invalid userUid" });
  }

  try {
    await admin.auth().deleteUser(userUid);

    await admin.firestore().collection("users").doc(userUid).delete();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ error: "Error deleting driver" });
  }
}
