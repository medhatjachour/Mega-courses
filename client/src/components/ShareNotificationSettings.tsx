"use client"
import { NotificationSettingsFormData, notificationSettingsSchema } from '@/lib/schemas'
import { useUpdateUserMutation } from '@/state/api'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Header from '@/components/Header'
import { Form } from '@/components/ui/form'
import { CustomFormField } from './CustomFormField'
import {Button} from "@/components/ui/button"

const ShareNotificationSettings = ({
    title="notification Settings",
    subtitle="Manage Your Notifications settings"
}:SharedNotificationSettingsProps) => {
    const {user} = useUser()
    const [updateUser] = useUpdateUserMutation()

    const currentSettings = (user?.publicMetadata as {settings?:UserSettings})?.settings ||{}

    const methods = useForm <NotificationSettingsFormData>({
        resolver:zodResolver  (notificationSettingsSchema),
        defaultValues:{
            courseNotifications:currentSettings.courseNotifications||false,
            emailAlerts:currentSettings.emailAlerts||false,
            smsAlerts:currentSettings.smsAlerts||false,
            notificationFrequency:currentSettings.notificationFrequency??"daily",
        }
    })
    const onSubmit = async(data:NotificationSettingsFormData)=>{
        if(!user) return;
        const updatedUser ={
            userId : user.id,
            publicMetadata:{
                ...user.publicMetadata,
                settings:{
                    ...currentSettings,
                    ...data
                }
            }
        }
        try{
            await updateUser(updatedUser)
        }catch(e){
                console.log("filed to update user",e);
        }
         
    }
    if(!user) return <div> pleas sing in </div>
  return (
    <div>
        <Header
        title={title}
        subtitle={subtitle}
        />
        <Form {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className='notification-settings__form '
            >
            <div className = "notification-settings__fields">
                <CustomFormField
                name = "courseNotifications"
                label = "Course Notifications"
                type="switch"
                />
                
                <CustomFormField
                name = "emailAlerts"
                label = "Email Alerts"
                type="switch"
                />
                
                <CustomFormField
                name = "smsAlerts"
                label = "SMS Alerts"
                type="switch"
                />
                  <CustomFormField
                name = "notificationFrequency"
                label = "Notification Frequency"
                type="select"
                options={[
                    {value:"immediate",label:"Immediate"},
                    {value:"daily",label:"Daily"},
                    {value:"weekly",label:"Weekly"}
                ]}
                />
            </div>

            <Button type="submit" className="notification-settings__submit">
                Update settings
            </Button>
            </form>
        </Form>
    </div>
  )
}

export default ShareNotificationSettings