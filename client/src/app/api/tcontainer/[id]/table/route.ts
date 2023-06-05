import { idCtx } from "@/types/api";
import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

const apiURL = process.env.API_URL || "";

export async function GET(req: NextRequest, context: idCtx) {
  const id = Math.abs(+context.params.id);
  const key = cookies().get("accessToken")?.value || "";

  if (isNaN(id)) {
    return NextResponse.json({
      ok: false,
      msg: "Invalid Request!",
    });
  }

  if (!key) {
    return NextResponse.json({
      ok: false,
      msg: "Unauthorized!(c)",
    });
  }

  const data = await fetch(`${apiURL}/v1/table/container/${id}/table`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return NextResponse.json({ ...data });
}

// export async function POST(req: NextRequest, context: idCtx) {
//   const id = Math.abs(+context.params.id);
//   const key = cookies().get("accessToken")?.value || "";

//   if (isNaN(id)) {
//     return NextResponse.json({
//       ok: false,
//       msg: "Invalid Request!",
//     });
//   }

//   if (!key) {
//     return NextResponse.json({
//       ok: false,
//       msg: "Unauthorized!(c)",
//     });
//   }

//   const data = await fetch(`${apiURL}/v1/table/container/${id}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${key}`,
//     },
//     body: JSON.stringify(await req.json()),
//   })
//     .then((res) => res.json())
//     .catch((e) => {
//       console.log(e);
//       return { ok: false, msg: "Communication Failed! Please Check Server!" };
//     });

//   return NextResponse.json({ ...data });
// }
