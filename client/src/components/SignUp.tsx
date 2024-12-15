"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import React from "react";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";
const SignUpComponent = () => {
  const { user } = useUser();
  // client component
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");
  const signInUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=false`
    : "/signin";
  // Define the getRedirectURL function
  const getRedirectURL = () => {
    // Check if the current page is the checkout page
    if (isCheckoutPage) {
      // If true, return a URL with a query string that sets the step to 2 and includes the course ID
      return `checkout?step=2&id=${courseId}`;
    }
    // Retrieve the user type from the user's public metadata
    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
      // If the user is a teacher, return the URL for the teacher's courses page
      return `/teacher/courses`;
    }
    // If none of the above conditions are met (i.e., it's not a checkout page and the user is not a
    //teacher),xreturn the URL for the user's courses page
    return `/user/courses`;
  };

  return (
    <SignUp
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "shadow-none",
          card: "bg-customgreys-secondarybg w-full shadow-none",
          footer: {
            background: "#25262f",
            padding: "0rem 2.5rem",
            "& > div > div:nth-child(1)": {
              background: "#25262f",
            },
          },
        },
      }}
      signInUrl={signInUrl}
      forceRedirectUrl={getRedirectURL()}
      routing="hash"
      afterSignOutUrl="/"
    />
  );
};

export default SignUpComponent;
