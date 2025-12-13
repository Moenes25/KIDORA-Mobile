// context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
  }),
});

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    Notifications.setNotificationCategoryAsync("child_action", [
      { identifier: "view_map", buttonTitle: "View Map 🗺️", options: { opensAppToForeground: true } },
      { identifier: "call_child", buttonTitle: "Call 📞", options: { opensAppToForeground: true } },
    ]);

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const newNotification = { 
        ...notification, 
        read: false, 
        id: notification.request.identifier,
        date: new Date()
      };
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, []);

  const sendChildAlert = async (childName, status, location) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${childName} • ${status}`,
        body: `${childName} has just left ${location}. Tap to view location.`,
        data: { childName, location },
        categoryIdentifier: "child_action",
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  };

  // ✅ UPDATED: Toggle Read/Unread Status
  const toggleReadStatus = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.request.identifier === notificationId) {
          const newStatus = !n.read; // Toggle the status
          
          // Update badge count
          if (newStatus === true) {
             // If becoming read, decrease count
             setUnreadCount((c) => Math.max(0, c - 1));
          } else {
             // If becoming unread, increase count
             setUnreadCount((c) => c + 1);
          }
          
          return { ...n, read: newStatus };
        }
        return n;
      })
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications((prev) => {
      const isUnread = prev.find(n => n.request.identifier === notificationId)?.read === false;
      if (isUnread) setUnreadCount((c) => Math.max(0, c - 1));
      return prev.filter((n) => n.request.identifier !== notificationId);
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // ❌ REMOVED 'markAsRead' in favor of 'toggleReadStatus'
  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notifications,
        unreadCount,
        setUnreadCount,
        sendChildAlert,
        toggleReadStatus, // ✅ Use this instead of markAsRead
        removeNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;
  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}