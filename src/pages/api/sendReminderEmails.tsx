import type { NextApiRequest, NextApiResponse } from "next";

const callReminderEndpoint = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to call ${url}: ${response.statusText}`);
  }
  return response.json();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const inspectionReminderResponse = await callReminderEndpoint("/api/sendTechnicalInspectionEmail");

    const insuranceReminderResponse = await callReminderEndpoint("/api/sendInsurancePolicyEmail");

    res.status(200).json({
      message: "Notification process completed.",
      inspectionReminderResponse,
      insuranceReminderResponse,
    });
  } catch (error) {
    console.error("Error in notification process:", error);
    res.status(500).json({ error: "Failed to send reminders." });
  }
}
