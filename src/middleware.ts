import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./session";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  // Temporary(?) redirect from index to recycle
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/aterbruk", req.nextUrl));
  }

  // Only logged in users are allowed access to the recycle pages.
  if (req.nextUrl.pathname.startsWith("/aterbruk")) {
    // If the user is not logged in, redirect them to the login page.
    if (!session.user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // To go to any page other than the index recycle page, the user must have permission to add/edit recycle items.
    if (!(req.nextUrl.pathname.endsWith("/aterbruk") || req.nextUrl.pathname.endsWith("/aterbruk/"))) {
      if (!(session.user.isRecycler || session.user.isAdmin)) {
        return new NextResponse(JSON.stringify({ message: "You do not have access to this page" }), { status: 403 });
      }
    }
  }

  // Only admins are allowed access to the admin pages.
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // If the user is not logged in, redirect them to the login page.
    if (!session.user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (!session.user.isAdmin) {
      return new NextResponse(JSON.stringify({ message: "You do not have access to this page" }), { status: 403 });
    }
  }

  return res;
}