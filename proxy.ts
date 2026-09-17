import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { clerkConfigured } from "@/lib/auth";

const isProtectedRoute = createRouteMatcher(["/client(.*)"]);
const withClerk = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) await auth.protect();
});

export default clerkConfigured
  ? withClerk
  : function proxy(_request: NextRequest) {
      return NextResponse.next();
    };

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|glb|ttf|woff2?|ico|webmanifest)).*)", "/(api|trpc)(.*)"],
};
