import ShareNotificationSettings from "@/components/ShareNotificationSettings";
import React from "react";

const TeacherSettings = () => {
  return (
    <div className="w-3/5">
      <ShareNotificationSettings
        title="Teacher setting"
        subtitle="Mange your Teacher notification "
      />
    </div>
  );
};

export default TeacherSettings;
