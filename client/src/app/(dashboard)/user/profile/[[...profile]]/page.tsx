import Header from '@/components/Header'
import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

const UserProfilePage = () => {
  return (
    <div>
       <Header title={"profile"} subtitle='some subtitle' /> 
       <UserProfile
        path ="/user/profile"
        routing='path'
        appearance={{
            baseTheme:dark,
            elements:{
                scrollBox:"bg-customgreys-darkGrey",
                navbar:{
                    "&>div:nth-child(1)":{
                        background:"none"
                    }
                }
            }
        }}
       />
    </div>
  )
}

export default UserProfilePage