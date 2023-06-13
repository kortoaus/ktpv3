import apiURL from "@/libs/apiURL";
import { ApiResultType } from "@/types/api";
import { cookies } from "next/dist/client/components/headers";
import { Coming_Soon } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

type ResultProps = ApiResultType & {
  id: string | null;
};

export async function POST(req: NextRequest) {
  const key = cookies().get("accessToken")?.value || "";

  const data: ResultProps = await fetch(`${apiURL}/v1/file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      // "Content-Type": "multipart/form-data",
    },
    body: await req.formData(),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return NextResponse.json({ ...data });
}
