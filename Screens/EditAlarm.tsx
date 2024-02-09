import { NavigationProp, RouteProp } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import {
  EditAlarmScreenNavigationProp,
  EditAlarmScreenRouteProp,
  RootStackParamList,
} from '../NavigationProps/NavProps'
import {
  PanResponder,
  View,
  Text,
  TextInput,
  SafeAreaView,
  Switch,
  Button,
} from 'react-native'
import Alarm from '../Models/Alarm'

type EditAlarmProps = {
  route: EditAlarmScreenRouteProp
  navigation: EditAlarmScreenNavigationProp
}

const EditAlarm: React.FC<EditAlarmProps> = ({ navigation, route }) => {
  const [alarm, setAlarm] = useState(route.params.alarm)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e) => true,
      onPanResponderMove: (e, gestureState) => {
        const dy = gestureState.dy
        if (dy < -100) {
          navigation.navigate('EditMapAlarm', { alarm })
        }
      },
    })
  ).current

  const handleAlarmChange = <T extends keyof Alarm>(
    value: Alarm[T],
    name: T
  ) => {
    setAlarm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      {!alarm && (
        <SafeAreaView>
          <Text>Loading...</Text>
        </SafeAreaView>
      )}
      {alarm && (
        <SafeAreaView
          style={{ height: '100%' }} /*{...panResponder.panHandlers}*/
        >
          <View>
            <Text
              style={{
                marginTop: 10,
                marginLeft: 20,
                fontWeight: 'bold',
              }}
            >
              Title
            </Text>
            <TextInput
              style={{
                margin: 10,
                marginTop: 5,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                fontSize: 16,
              }}
              placeholder="Title"
              textBreakStrategy={'simple'}
              underlineColorAndroid={'transparent'}
              autoCorrect
              onChangeText={(e) => {
                handleAlarmChange(e, 'title')
              }}
            />
          </View>
          <View>
            <Text
              style={{
                marginTop: 10,
                marginLeft: 20,
                fontWeight: 'bold',
              }}
            >
              Description
            </Text>
            <TextInput
              style={{
                margin: 10,
                marginTop: 5,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                fontSize: 16,
                maxHeight: 150,
              }}
              placeholder="Description"
              multiline={true}
              textBreakStrategy={'simple'}
              underlineColorAndroid={'transparent'}
              autoCorrect
              onChangeText={(e) => {
                handleAlarmChange(e, 'description')
              }}
            >
              {alarm.description}
            </TextInput>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontWeight: 'bold',
                }}
              >
                Is Active?
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Switch
                  style={{
                    margin: 10,
                    marginTop: 0,
                  }}
                  onValueChange={(value) => {
                    handleAlarmChange(value, 'isActive')
                  }}
                  value={alarm.isActive}
                />
              </View>
            </View>

            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontWeight: 'bold',
                }}
              >
                Is one ring only??
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Switch
                  style={{
                    margin: 10,
                    marginTop: 0,
                  }}
                  onValueChange={(value) => {
                    handleAlarmChange(value, 'isOneTime')
                  }}
                  value={alarm.isOneTime}
                />
              </View>
            </View>
          </View>
          <View>
            <Button
              title="next"
              onPress={() => navigation.navigate('EditMapAlarm', { alarm })}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  )
}

export default EditAlarm
