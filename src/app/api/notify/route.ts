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
    const status =
      body && typeof body === "object" && "status" in body
        ? (body as { status?: unknown }).status
        : undefined;

    console.log("[notify] request received", { status });

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request body is required" },
        { status: 400 }
      );
    }

    if (typeof status !== "string") {
      return NextResponse.json(
        { success: false, error: 'Invalid input: "status" must be a string' },
        { status: 400 }
      );
    }

    if (status !== "completed") {
      return NextResponse.json(
        { success: false, error: 'Invalid status: expected "completed"' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title: "Scan Completed",
        message: "New scan uploaded — ready for review",
        userId: "demo-user",
      },
    });

    console.log("[notify] notification created", { notificationId: notification.id });

    return NextResponse.json({ success: true, notification }, { status: 200 });
  } catch (err) {
    const error = err as { message?: string; stack?: string };
    console.error("[notify] error", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
