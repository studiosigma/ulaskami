import { NextRequest, NextResponse } from "next/server";
import { findMerchantByEmail, createMerchant } from "@/lib/db/plates";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email bisnis, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal harus terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    const existing = await findMerchantByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar. Silakan masuk." },
        { status: 400 }
      );
    }

    const { hash, salt } = hashPassword(password);
    const newMerchant = await createMerchant({
      name: name.trim(),
      email: email.trim(),
      passwordHash: hash,
      passwordSalt: salt,
    });

    const user = {
      id: newMerchant.id,
      name: newMerchant.name,
      email: newMerchant.email,
    };

    await setSessionCookie(user);

    return NextResponse.json({
      success: true,
      message: "Akun berhasil dibuat!",
      user,
    });
  } catch (err) {
    console.error("[Register API Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat mendaftar." },
      { status: 500 }
    );
  }
}
