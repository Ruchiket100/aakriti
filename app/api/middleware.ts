import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
	const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
	const isLoginPage = req.nextUrl.pathname === "/admin/login";
	const session = req.cookies.get("admin_session")?.value;

	if (isAdminRoute && !isLoginPage && session !== "authenticated") {
		return NextResponse.redirect(new URL("/admin/login", req.url));
	}
	return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
