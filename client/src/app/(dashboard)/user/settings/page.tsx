import ShareNotificationSettings from "@/components/ShareNotificationSettings";
import React from "react";

const UserSettings = () => {
  return (
    <div className="w-3/5">
      <ShareNotificationSettings
        title="User setting"
        subtitle="Mange your user notification "
      />
    </div>
  );
};

export default UserSettings;
