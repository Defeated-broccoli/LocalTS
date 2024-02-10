import { useState, useEffect, useRef } from 'react'
import { Button, Platform } from 'react-native'

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  })
}

const PushNotificationComponent = ({
  showButtons,
}: {
  showButtons: boolean
}) => {
  let expoPushToken: Notifications.ExpoPushToken = null
  let notification: Notifications.Notification
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  })

  async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | null> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    if (Device.isDevice) {
      await Notifications.getPermissionsAsync()
        .then((status) => {
          if (!status.granted) {
            Notifications.requestPermissionsAsync()
              .then((result) => {
                if (!result.granted) {
                  console.log('Result is not granted', result)
                }
              })
              .catch((e) =>
                console.log('Error while asking for permission: ', e)
              )
          }
        })
        .catch((e) =>
          console.log('Error while checking notification permission: ', e)
        )

      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid

      Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      }).then((pushToken) => {
        return pushToken
      })
    } else {
      alert('Must use physical device for Push Notifications')
    }

    return null
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => (expoPushToken = token))
      .catch((e) => console.log('Error with push token', e))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notify) => {
        notification = notify
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    showButtons && (
      <Button
        title="notification"
        onPress={async () => {
          await schedulePushNotification()
        }}
      />
    )
  )
}

export default PushNotificationComponent
