import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./auth/server";
import { request } from "node:http";


import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest){
const {searchParams , pathname} = new URL(request.url);
const user = await getUser();

console.log(user);


const PUBLIC_PATHS = ['/login', '/sign-up'];

const isPublicPath = PUBLIC_PATHS.some((path)=> {
    return pathname.startsWith(path);
})

let supabaseResponse = NextResponse.next({request});

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );


const authRoute = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/sign-up";

if(authRoute){
    const {data : {user},} = await supabase.auth.getUser();
    if(user){
        return NextResponse.redirect(new URL("/", request.url));
    }
}




if(!searchParams.get("noteId") && pathname === "/"){
    const {data:{user}} = await supabase.auth.getUser();

    if(user){


        const {latestNoteId} = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-latest-note?userId=${user.id}`).then(res=>{
   

            return res.json();})    ;

        if (latestNoteId){
            const url = request.nextUrl.clone();
            url.searchParams.set("noteId", latestNoteId);
            return NextResponse.redirect(url);
        }else {
            const {noteId} = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,{
method : 'POST',
headers : {"Content-Type" : "application/json"}
            } ).then(res=> res.json());

            const url = request.nextUrl.clone();
            url.searchParams.set("noteId", noteId); 
            return NextResponse.redirect(url); 
        }
    }
}

if(!user && !isPublicPath){
return NextResponse.redirect(new URL('/login', request.url));
}
    return supabaseResponse;
}



export const config ={
    matcher : [
            '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}