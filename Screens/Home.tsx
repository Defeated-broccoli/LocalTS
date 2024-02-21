import { View, Text, SafeAreaView, Button, StyleSheet } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useState, useEffect } from 'react'

import dbConnection from '../Db/SQLite'
import { Alarm } from '../Models/Alarm'
import AlarmListComponent from '../Components/AlarmListComponent'
import {
  HomeScreenNavigationProp,
  HomeScreenRouteProp,
} from '../NavigationProps/NavProps'
import { startBackgroundTask } from '../BackgroundTask/BackgroundTask'
import { registerForPushNotificationsAsync } from '../BackgroundTask/PushNotification'
import TopBarComponent from '../Components/TopBarComponent'
import DefaultButton from '../Components/DefaultButton'
import { secondaryColor } from '../Constants/constants'

type HomeProps = {
  route: HomeScreenRouteProp
  navigation: HomeScreenNavigationProp
}

const Home: React.FC<HomeProps> = ({ navigation, route }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const isFocused = useIsFocused()

  useEffect(() => {
    dbConnection
      .getAlarms()
      .then((result) => {
        setAlarms(result)
      })
      .catch((error) => console.log(error))
  }, [isFocused])

  useEffect(() => {
    setupBackgroundTask()
  }, [])

  const setupBackgroundTask = async () => {
    await registerForPushNotificationsAsync()
      .then((result) => {
        if (!result) console.log('Push notification register failed')
        // else {
        //   scheduleTestNotification()
        // }
      })
      .catch((e) => {
        console.log('Push notification failed', e)
      })

    startBackgroundTask()
      .then((result) => {
        if (!result) console.log('Failed on starting background task')
      })
      .catch((e) => {
        console.log('Failed on starting background task', e)
      })
  }

  const handleAlarmDelete = (alarm: Alarm) => {
    //setAlarms((prev) => {
    dbConnection
      .deleteAlarm(alarm)
      .then()
      .catch((error) => console.log(error))
    //return prev.filter((a) => a.id !== alarm.id)
    //})
  }

  return (
    <SafeAreaView style={styles.home}>
      <TopBarComponent navigation={navigation} />
      <AlarmListComponent
        alarmListStyle={styles.alarmListComponent}
        alarms={alarms}
        handleEditAlarm={(alarm) => {
          navigation.navigate('EditAlarm', { alarm })
        }}
        handleDeleteAlarm={(alarm) => {
          handleAlarmDelete(alarm)
        }}
      />
      <DefaultButton
        defaultButtonStyle={styles.defaultButtonComponent}
        title={'Add new alarm'}
        onPress={() => {
          navigation.navigate('EditAlarm', {
            alarm: null,
          })
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  home: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: secondaryColor,
  },
  alarmListComponent: {
    flexGrow: 1,
    overflow: 'scroll',
  },
  defaultButtonComponent: {},
})

export default Home
