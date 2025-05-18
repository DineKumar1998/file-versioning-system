import { useState } from "react";

type NotificationType = "success" | "error";

export default function useNotification() {
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });

    setTimeout(() => setNotification(null), 3000);
  };

  const hideNotification = () => setNotification(null);

  return { notification, showNotification, hideNotification };
}
