import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * CHALLENGE: MESSAGING SYSTEM
 * 
 * Your goal is to build a basic communication channel between the Patient and Dentist.
 * 1. Implement the POST handler to save a new message into a Thread.
 * 2. Implement the GET handler to retrieve message history for a given thread.
 * 3. Focus on data integrity and proper relations.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");

  if (!threadId) {
    return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
  }

  // TODO: Fetch messages for this thread
  const messages = []; // fetch from prisma

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content =
      body && typeof body === "object" && "content" in body
        ? (body as { content?: unknown }).content
        : undefined;

    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid input: "content" is required' },
        { status: 400 }
      );
    }

    const defaultPatientId = "default-patient";

    let thread = await prisma.thread.findFirst({
      where: { patientId: defaultPatientId },
    });

    if (!thread) {
      thread = await prisma.thread.create({
        data: { patientId: defaultPatientId },
      });
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        threadId: thread.id,
        sender: "patient",
      },
    });

    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (err) {
    console.error("Messaging API Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
