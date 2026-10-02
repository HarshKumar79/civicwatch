import { withAuth } from "next-auth/middleware";

// Routes defined here require authentication.
// Unauthenticated users will be redirected to the login page.
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Yahan hum define kar rahe hain ki kin pages ko protect karna hai
  matcher: [
    "/parking/:path*", 
    "/pollution/:path*", 
    "/rewards/:path*", 
    "/admin/:path*"
  ],
};