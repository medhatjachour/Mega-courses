import {Bell, BookOpen} from 'lucide-react'
import Link from "next/link";

import React from "react";

const NonDashboardNavbar = () => {
  return <nav className="nonDashboard-navbar">
    <div className="nonDashboard-navbar__container">
      <div className='nonDashboard-navbar__search'>

      <Link href="/" className="nonDashboard-navbar__brand">
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
          <BookOpen className="nonDashboard-navbar__search-icon mr-1"></BookOpen>
        </Link>
        </div>
      </div>
      
      </div>
    </div>
    <div className='nonDashboard-navbar__actions'>
      <button className='nonDashboard-navbar__notification-button'>
        <span className='nonDashboard-navbar__notification-indicator'></span>
        <Bell className='nonDashboard-navbar__notification-icon'/>
      </button>
      {/* sign in button  */}
    </div>
  </nav>;
};

export default NonDashboardNavbar;
