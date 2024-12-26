"use client"
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import {Bell, BookOpen} from 'lucide-react'
import Link from "next/link";

import React from "react";

const NonDashboardNavbar = () => {
const {user} = useUser()
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  return <nav className="nonDashboard-navbar">
    <div className="nonDashboard-navbar__container">
      <div className='nonDashboard-navbar__search'>

      <Link href="/" className="nonDashboard-navbar__brand" scroll={false}>
        CourseMega
      </Link>
      <div className="flex items-center gap-4">
        <div className='relative group'>
        <Link href="/search" className="nonDashboard-navbar__search-input">
          <span className = "hidden sm:inline">
            Search Courses 
          </span>
          <span className="sm:hidden">
            Search
          </span>
          <BookOpen className="nonDashboard-navbar__search-icon mr-1" size={18}></BookOpen>
        </Link>
        </div>
      </div>
    </div>
    <div className='nonDashboard-navbar__actions'>
      <button className='nonDashboard-navbar__notification-button'>
        <span className='nonDashboard-navbar__notification-indicator'></span>
        <Bell className='nonDashboard-navbar__notification-icon'/>
      </button>
      {/* sign in button  */}
      <SignedIn>
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
      </SignedIn>
      <SignedOut>
        <Link href="/signin" className="nonDashboard-navbar__auth-button--login" scroll={false}>
        Log In</Link>
        
        <Link href="/signup" className="nonDashboard-navbar__auth-button--signup" scroll={false}>
        Sign Up</Link>
      </SignedOut>
    </div>
    </div>
  </nav>;
};

export default NonDashboardNavbar;
