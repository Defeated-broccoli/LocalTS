import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'

import * as Notifications from 'expo-notifications'

import * as Location from 'expo-location'
import { Alarm } from '../Models/Alarm'

import dbConnection from '../Db/SQLite'
import { schedulePushNotification } from './PushNotification'

const locAlTask = 'LOCAL_APP_CHECK_LOC_TASK'

TaskManager.defineTask(locAlTask, async () => {
  locationTaskAsync()
})

const startBackgroundTask = async (): Promise<boolean> => {
  const isGranted = await Location.isBackgroundLocationAvailableAsync().then(
    async (result) => {
      if (!result) {
        const permission = await Location.requestBackgroundPermissionsAsync()

        return permission.granted
      } else {
        return result
      }
    }
  )

  if (!isGranted) {
    console.log('Background location permission is not granted!')
    return false
  }

  if (
    ((await checkStatusAsync()) && (await checkTaskRegisteredAsync())) ||
    (await registerTaskAsync())
  ) {
    console.log('Task is registered')
    return true
  } else {
    registerTaskAsync()
  }
}

const checkStatusAsync = async (): Promise<boolean> => {
  return BackgroundFetch.getStatusAsync()
    .then((result) => {
      if (result === BackgroundFetch.BackgroundFetchStatus.Available) {
        return true
      } else {
        return false
      }
    })
    .catch((e) => {
      console.log('Error while checking status', e)
      return false
    })
}

const checkTaskRegisteredAsync = async (): Promise<boolean> => {
  return TaskManager.isTaskRegisteredAsync(locAlTask)
    .then((result) => {
      return result
    })
    .catch((e) => {
      console.log('Error while checking registered task result', e)
      return false
    })
}

const registerTaskAsync = async (): Promise<boolean> => {
  return BackgroundFetch.registerTaskAsync(locAlTask, {
    minimumInterval: 10,
    stopOnTerminate: false,
    startOnBoot: true,
  }).then((result) => {
    return checkTaskRegisteredAsync()
  })
}

const unregisterTaskAsync = async (): Promise<boolean> => {
  return BackgroundFetch.unregisterTaskAsync(locAlTask)
    .then((result) => {
      return checkTaskRegisteredAsync()
    })
    .catch((e) => {
      console.log('Error while unregistering task', e)
      return false
    })
}

const locationTaskAsync = async () => {
  console.log('Task starts...', new Date(Date.now()))

  //getCurrentPositionAsync() takes long time to load and crashes often
  //getLastKnownPosition() often returns null
  Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Low
  })
    .then((loc) => {
      console.log(loc)
      dbConnection
        .getAlarms()
        .then((alarms) => {
          console.log(`Scanning ${alarms.length} alarms...`)
          alarms.forEach((alarm, index) => {
            console.log(`Alarm at ${index}/id: ${alarm.id} calculating...`)
            if (alarm.location != null && loc?.coords != null) {
              const distance = calculateDistance(
                alarm.location.lat,
                alarm.location.lon,
                loc.coords.latitude,
                loc.coords.longitude
              )

              if (distance <= alarm.location.rangeKm && alarm.isActive) {
                schedulePushNotification(alarm, new Date(Date.now())).then(
                  (id) => console.log(id)
                )

                if (alarm.isOneTime)
                  dbConnection.updateAlarm({ ...alarm, isActive: false })

                console.log('Alarm captured', alarm)
              }
            }
          })
          console.log('Task finished', new Date(Date.now()))
        })
        .catch((e) => console.log(`Alarm failed: ${e}`))
    })
    .catch((e) => {
      console.log('Error while getting position', e)
      return null
    })
}

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

export { startBackgroundTask, unregisterTaskAsync }
