import apiURL from "@/libs/apiURL";
import { ApiResultType } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

type ResultProps = ApiResultType & {
  id: string | null;
};

export async function GET(
  req: NextRequest,
  context: { params: { fileId: string } }
) {
  const image = await fetch(`${apiURL}/imgs/${context.params.fileId}`).then(
    (res) => res.blob()
  );

  return NextResponse.json({ ok: true });
}
