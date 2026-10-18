import { NextRequest, NextResponse } from "next/server";
import { updateFeedbackStatus } from "@/lib/db/plates";
import { getCurrentSession, isUserAdmin } from "@/lib/auth";
import { FeedbackStatus } from "@/lib/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses: FeedbackStatus[] = ["unread", "resolved", "archived"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid. Harus salah satu dari: unread, resolved, archived." },
        { status: 400 }
      );
    }

    const isAdmin = isUserAdmin(session.email);
    const updated = await updateFeedbackStatus(id, status, session.email, isAdmin);
    if (!updated) {
      return NextResponse.json(
        { error: "Feedback tidak ditemukan atau Anda tidak memiliki izin untuk mengubahnya." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui status";
    console.error("[PATCH /api/feedback/[id] Error]:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
