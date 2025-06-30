import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./auth/server";

export async function middleware(request: NextRequest){
    const {pathname} = request.nextUrl;
console.log(pathname);
console.log("MIDDLEWARE IS RUNNING");


const user = await getUser();

console.log(user);


const PUBLIC_PATHS = ['/login', '/sign-up'];

const isPublicPath = PUBLIC_PATHS.some((path)=> {
    return pathname.startsWith(path);
})

if(!user && !isPublicPath){
return NextResponse.redirect(new URL('/login', request.url));
}
    return NextResponse.next();
}


export const config ={
    matcher : [
            '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}