import { useState, useEffect, useRef } from 'react'
import { Button } from 'react-native'

import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'

import * as Notifications from 'expo-notifications'

import * as Location from 'expo-location'
import { Alarm } from '../Models/Alarm'

import dbConnection from '../db/SQLite'

const locAlTask = 'LOCAL_APP_CHECK_LOC_TASK'

const calculateDistance = (
  alarmLat: number,
  alarmLon: number,
  positionLat: number,
  positionLon: number
) => {
  const R = 6371e3 // metres
  const φ1 = (alarmLat * Math.PI) / 180 // φ, λ in radians
  const φ2 = (positionLat * Math.PI) / 180
  const Δφ = ((positionLat - alarmLat) * Math.PI) / 180
  const Δλ = ((positionLon - alarmLon) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = (R * c) / 1000 // in km

  return d
}

const schedulePushNotification = async (alarm: Alarm, date: Date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: alarm.title,
      body: alarm.description,
      data: { data: date },
    },
    trigger: { seconds: 2 },
  })
}

const locationTask = async () => {
  const now = new Date(Date.now())
  const loc = await Location.getCurrentPositionAsync()

  dbConnection
    .getAlarms()
    .then((alarms) => {
      alarms.forEach((alarm) => {
        if (alarm.location != null && loc?.coords != null) {
          const distance = calculateDistance(
            alarm.location.lat,
            alarm.location.lon,
            loc.coords.latitude,
            loc.coords.longitude
          )

          if (distance <= alarm.location.rangeKm && alarm.isActive) {
            schedulePushNotification(alarm, now)

            if (alarm.isOneTime)
              dbConnection.updateAlarm({ ...alarm, isActive: false })
          }
        }
      })
    })
    .catch((e) => console.log(`Alarm failed: ${e}`))
}

TaskManager.defineTask(locAlTask, async () => {
  locationTask()
})

const BackgroundTaskComponent = ({ showButtons }: { showButtons: boolean }) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false)
  const [status, setStatus] = useState<BackgroundFetch.BackgroundFetchStatus>()

  const registerTaskAsync = async () => {
    await BackgroundFetch.registerTaskAsync(locAlTask, {
      minimumInterval: 10,
      stopOnTerminate: false,
      startOnBoot: true,
    })

    await checkStatusAsync()
  }

  const unregisterTaskAsync = async () => {
    await BackgroundFetch.unregisterTaskAsync(locAlTask).catch((e) =>
      console.log(e)
    )

    await checkStatusAsync()
  }

  const checkStatusAsync = async () => {
    BackgroundFetch.getStatusAsync()
      .then((result) => {
        setStatus(result)
        console.log(result)
      })
      .catch((err) => console.log(err))

    await TaskManager.isTaskRegisteredAsync(locAlTask)
      .then((result) => {
        setIsRegistered(result)
        console.log(result)
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    Location.requestBackgroundPermissionsAsync().then((result) =>
      console.log(`Permission response: ${result.status}`)
    )

    checkStatusAsync().then(() => {
      if (status !== BackgroundFetch.BackgroundFetchStatus.Available) {
        unregisterTaskAsync().then(() => registerTaskAsync())
      }
    })
  }, [])

  return (
    showButtons && (
      <Button
        title="Register task"
        onPress={async () => {
          locationTask()
        }}
      ></Button>
    )
  )
}

export default BackgroundTaskComponent
