import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { Alarm } from '../Models/Alarm'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

async function registerForPushNotificationsAsync(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    if (!(await checkPermissionStatus()) || !(await handleExpoToken())) {
      return false
    }
  } else {
    alert('Must use physical device for Push Notifications')
    return false
  }

  console.log('Notification is registered')
  return true
}

const checkPermissionStatus = async (): Promise<boolean> => {
  return await Notifications.getPermissionsAsync()
    .then(async (status) => {
      if (!status.granted) {
        await Notifications.requestPermissionsAsync()
          .then((result) => {
            return result.granted
          })
          .catch((e) => {
            console.log('Error while asking for permission: ', e)
            return false
          })
      } else {
        return true
      }
    })
    .catch((e) => {
      console.log('Error while checking notification permission: ', e)
      return false
    })
}

const handleExpoToken = async (): Promise<boolean> => {
  return Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId,
  })
    .then((result) => {
      return result.data != null ? true : false
    })
    .catch((e) => {
      console.log('Error while handling expo token', e)
      return false
    })
}

const scheduleTestNotification = async (): Promise<string> => {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  }).catch((e) => {
    console.log('Error while scheduling test notification', e)
    return 'Failed to schedule test notification. Error is null.'
  })
}

const schedulePushNotification = async (
  alarm: Alarm,
  date: Date
): Promise<string> => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: alarm.title,
      body: alarm.description,
      data: { data: date },
    },
    trigger: { seconds: 2 },
  }).catch((e) => {
    console.log('Error while scheduling notification', e)
    return 'Failed to schedule notification. Error is null.'
  })
}

export {
  registerForPushNotificationsAsync,
  scheduleTestNotification,
  schedulePushNotification,
}
