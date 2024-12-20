"use client";
import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  //   /handle use effect is course page
  if (!isLoaded) return <Loading />;
  if (!user) return <div> Please sign to access this page</div>;
  return (
    <SidebarProvider>
      {/* <div className="dashboard"> */}
        {/* side bar */}
        <AppSidebar/>
        <div className="dashboard">
        
        <Navbar isCoursePage={false}/>
        <div className="dashboard__content">
          {/* chapter  side bar  */}
          <div className={cn("dashboard__main")} style={{ height: "100vh" }}>
            <main className="dashboard__body ">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
