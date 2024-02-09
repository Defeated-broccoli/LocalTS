import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Alarm } from '../Models/Alarm'

type RootStackParamList = {
  Home: undefined
  EditAlarm: { alarm: Alarm }
  EditMapAlarm: { alarm: Alarm }
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>

type EditAlarmScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditAlarm'
>
type EditAlarmScreenRouteProp = RouteProp<RootStackParamList, 'EditAlarm'>

type EditMapAlarmScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditMapAlarm'
>
type EditMapAlarmScreenRouteProp = RouteProp<RootStackParamList, 'EditMapAlarm'>

export {
  RootStackParamList,
  HomeScreenNavigationProp,
  HomeScreenRouteProp,
  EditAlarmScreenNavigationProp,
  EditAlarmScreenRouteProp,
  EditMapAlarmScreenNavigationProp,
  EditMapAlarmScreenRouteProp,
}
