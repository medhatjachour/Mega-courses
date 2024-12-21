import { createRouteMatcher, clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Create a route matcher for student routes
const isStudentRoute = createRouteMatcher(['/user/(.*)']);
// Create a route matcher for teacher routes
const isTeacherRoute = createRouteMatcher(['/teacher/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Extract session claims using the auth function
  const { sessionClaims } = await auth();
  // Extract the user role from session claims metadata, default to 'student' if not found
  const userRole = (sessionClaims?.metadata as { userType: 'student' | 'teacher' })?.userType || 'teacher';

  // Check if the request is for a student route
  if (isStudentRoute(req)) {
    // If the user role is not 'student', redirect to the teacher's courses page
    if (userRole !== 'student') {
      const url = new URL('/teacher/courses', req.url);
      return NextResponse.redirect(url);
    }
  }

  // Check if the request is for a teacher route
  if (isTeacherRoute(req)) {
    // If the user role is not 'teacher', redirect to the user's courses page
    if (userRole !== 'teacher') {
      const url = new URL('/user/courses', req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
