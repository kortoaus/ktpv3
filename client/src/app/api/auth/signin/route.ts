import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

const apiURL = process.env.API_URL || "";

type ResultProps = {
  ok: boolean;
  msg?: string;
  token?: string;
};

export async function POST(req: NextRequest) {
  const received = await req.json();

  const data = await fetch(`${apiURL}/v1/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(received),
  })
    .then((res) => res.json())
    .then((data: ResultProps) => {
      if (data && data.ok && data.token) {
        cookies().set("accessToken", data.token);
        return {
          ok: true,
        };
      }

      return {
        ok: false,
        msg: data.msg || "Failed Sign In!",
      };
    })
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return NextResponse.json({ ...data });
}
