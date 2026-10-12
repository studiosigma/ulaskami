import { NextRequest, NextResponse } from "next/server";
import { findMerchantByEmail } from "@/lib/db/plates";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const merchant = await findMerchantByEmail(email);
    if (!merchant) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, merchant.passwordHash, merchant.passwordSalt);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    const user = {
      id: merchant.id,
      name: merchant.name,
      email: merchant.email,
    };

    await setSessionCookie(user);

    return NextResponse.json({
      success: true,
      message: "Berhasil masuk!",
      user,
    });
  } catch (err) {
    console.error("[Login API Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
