import { cookies } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const apiURL = process.env.API_URL || "";

type ResultProps = {
  ok: boolean;
  msg?: string;
  token?: string;
};

export async function GET(req: NextRequest) {
  cookies().delete("accessToken");

  return NextResponse.json({ ok: true });
}
