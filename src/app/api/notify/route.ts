import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * CHALLENGE: NOTIFICATION SYSTEM
 * 
 * Your goal is to implement a robust notification logic.
 * 1. When a scan is "completed", create a record in the Notification table.
 * 2. Return a success status to the client.
 * 3. Bonus: Handle potential errors (e.g., database connection issues).
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scanId, status } = body;

    if (status !== "completed") {
      return NextResponse.json(
        { error: 'Invalid status. Expected "completed"' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        message: "New scan uploaded — ready for review",
      },
    });

    console.log(`[NOTIFY] Notification created for scan ${scanId}`);

    return NextResponse.json(notification);
  } catch (err) {
    console.error("Notification API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
