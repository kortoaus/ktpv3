import { getData } from "@/libs/apiURL";
import { convertIP } from "@/libs/util";
import { headers } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const id = context.params.id;
//   const rawIp = headers().get(`x-forwarded-for`) || "";
//   const key = convertIP(rawIp);

//   const data = await getData(`/table/${id}`, key);

//   return NextResponse.json({ ...data });
// }

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  const rawIp = headers().get(`x-forwarded-for`) || "";
  const key = convertIP(rawIp);

  const data = await getData(
    encodeURI(`/sale/${id}/cancel`),
    key,
    "POST",
    JSON.stringify(await req.json())
  );
  // const data = { id };
  return NextResponse.json({ ...data });
}
