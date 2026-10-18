import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { testWebhookPing, validateWebhookUrl } from "@/lib/utils/webhook";

/**
 * POST /api/webhook/test
 * Uji coba ping Webhook (Discord, Slack, n8n, Make, custom CRM)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { webhookUrl, businessName } = body;

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json(
        { error: "URL Webhook wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUrl = webhookUrl.trim();
    const validation = validateWebhookUrl(cleanUrl);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || "URL Webhook tidak valid atau dilarang." },
        { status: 400 }
      );
    }

    const pingResult = await testWebhookPing(cleanUrl, businessName || "Outlet Anda");

    return NextResponse.json({
      success: pingResult.success,
      statusCode: pingResult.statusCode,
      error: pingResult.error,
      responseBody: pingResult.success ? pingResult.responseBody : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menguji webhook";
    console.error("[POST /api/webhook/test Error]:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
