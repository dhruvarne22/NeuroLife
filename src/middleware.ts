import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // 🔥 THIS is the ONLY valid way to get auth user in middleware
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.log("SUPABASE AUTH ERROR ->", error.message);
  }

  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.searchParams;

  const PUBLIC_PATHS = ["/login", "/sign-up" , "/sentry-example-page"];
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // 1) If logged-in user visits login/signup → redirect home
  if (isPublic && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2) If NOT logged in and trying to access private pages → redirect login
  if (!user && !isPublic) {
    const url = new URL("/login", request.url);
    url.searchParams.set("auth", "required");
    return NextResponse.redirect(url);
  }

  // 3) Auto-select latest note on "/"
  if (pathname === "/" && user && !search.get("noteId")) {
    const latestNote = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-latest-note?userId=${user.id}`
    ).then((r) => r.json());

    if (latestNote.latestNoteId) {
      const url = request.nextUrl.clone();
      url.searchParams.set("noteId", latestNote.latestNoteId);
      return NextResponse.redirect(url);
    }

    const created = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
      { method: "POST" }
    ).then((r) => r.json());

    const url = request.nextUrl.clone();
    url.searchParams.set("noteId", created.noteId);
    return NextResponse.redirect(url);
  }

  return response;
}


export const config ={
    matcher : [
            '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}