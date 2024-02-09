import { View, Text, SafeAreaView, Button } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { useState, useEffect } from 'react'

import dbConnection from '../db/SQLite'
import { Alarm, AlarmLocation } from '../Models/Alarm'
import TitleComponent from '../Components/TitleComponent'
import AlarmListComponent from '../Components/AlarmListComponent'
import {
  HomeScreenNavigationProp,
  HomeScreenRouteProp,
} from '../NavigationProps/NavProps'

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
        console.log(result)
      })
      .catch((error) => console.log(error))
  }, [isFocused])

  const handleAlarmDelete = (alarm: Alarm) => {
    setAlarms((prev) => {
      dbConnection
        .deleteAlarm(alarm)
        .then()
        .catch((error) => console.log(error))
      return prev.filter((a) => a.id !== alarm.id)
    })
  }

  return (
    <>
      <SafeAreaView
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <TitleComponent />
        <AlarmListComponent
          alarms={alarms}
          onEditClick={(alarm) => {
            navigation.navigate('EditAlarm', { alarm })
          }}
          onDeleteClick={(alarm) => {
            handleAlarmDelete(alarm)
          }}
        />
        <Button
          title={'Add new alarm'}
          onPress={() => {
            navigation.navigate('EditAlarm', {
              alarm: null,
            })
          }}
        />
      </SafeAreaView>
    </>
  )
}

export default Home
