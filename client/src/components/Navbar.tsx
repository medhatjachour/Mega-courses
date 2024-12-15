"use client"
import {  UserButton, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import {Bell, BookOpen} from 'lucide-react'
import Link from "next/link";

import React from "react";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const Navbar = ({isCoursePage}:{isCoursePage:boolean}) => {

const {user} = useUser()
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  return <nav className="dashboard-navbar">
    <div className="dashboard-navbar__container">
      <div className='dashboard-navbar__search'>

      <div  className="md:hidden">
        <SidebarTrigger className='dashboard-navbar__sidebar-trigger' />
      </div>
      <div className="flex items-center gap-4">
        <div className='relative group'>
        <Link href="/search" className= {cn("dashboard-navbar__search-input",{"!bg-customgreys-secondarybg":isCoursePage})}>
          <span className = "hidden sm:inline">
            Search Courses 
          </span>
          <span className="sm:hidden">
            Search
          </span>
          <BookOpen className="dashboard-navbar__search-icon mr-1" size={18}></BookOpen>
        </Link>
        </div>
      </div>
    </div>
    <div className='dashboard-navbar__actions'>
      <button className='nonDashboard-navbar__notification-button'>
        <span className='nonDashboard-navbar__notification-indicator'></span>
        <Bell className='nonDashboard-navbar__notification-icon'/>
      </button>
      {/* sign in button  */}

        <UserButton
        appearance={{
          baseTheme:dark,
          elements:{
            userButtonOuterIdentifier:"text-customgreys-dirtyGray",
            userButtonBox:"scale-90 sm scale:100"
          }
        }}
        showName={true}
        userProfileMode='navigation'
        userProfileUrl={userRole === "teacher"?"/teacher/profile":"/user/profile"}
        />
   

    </div>
    </div>
  </nav>;
};

export default Navbar;
