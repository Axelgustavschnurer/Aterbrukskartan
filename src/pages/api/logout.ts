import { NextRequest, NextResponse } from "next/server";
import { getSession, createResponse } from "@/session"

export default async function handler(
  req: NextRequest,
  res: NextResponse
) {
  const response = new Response();
  const session = await getSession(req, response);

  // Remove session to log out
  session.destroy();

  return createResponse(
    response,
    JSON.stringify({ message: 'Logged out' }),
    { status: 200 }
  );
}