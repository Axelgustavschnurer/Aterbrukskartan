import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./session";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  // Only certain users are allowed access to the recycle pages.
  // We assume that everyone *with an account* can access the recycle index page.
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

  // Only certain users are allowed access to the stories admin pages.
  if (req.nextUrl.pathname.startsWith("/stories")) {
    // If the user is not logged in, redirect them to the login page.
    if (!session.user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // The "index" page of stories is actually not located in the /stories folder, so it's visible to everyone by default.
    // As a result, no pages starting with /stories should be visible to non-admins/storytellers and we don't need any further checks.
    if (!(session.user.isStoryteller || session.user.isAdmin)) {
      return new NextResponse(JSON.stringify({ message: "You do not have access to this page" }), { status: 403 });
    }
  }

  return res;
}