import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentSession();
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[Auth Me API Error]:", err);
    return NextResponse.json({ user: null });
  }
}
