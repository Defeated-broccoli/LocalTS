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
  StyleSheet,
} from 'react-native'
import { Alarm } from '../Models/Alarm'
import TopBarComponent from '../Components/TopBarComponent'
import DefaultButton from '../Components/DefaultButton'
import {
  detailColor,
  primaryColor,
  primaryDarkColor,
  secondaryDarkColor,
} from '../Constants/constants'

type EditAlarmProps = {
  route: EditAlarmScreenRouteProp
  navigation: EditAlarmScreenNavigationProp
}

const EditAlarm: React.FC<EditAlarmProps> = ({ navigation, route }) => {
  const [alarm, setAlarm] = useState<Alarm>(
    route.params.alarm ?? {
      title: 'Title example',
      description: 'Desc example',
      location: {},
      isActive: true,
      isOneTime: false,
    }
  )

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

  const handleGoForward = () => {
    navigation.navigate('EditMapAlarm', { alarm })
  }

  return (
    <>
      <SafeAreaView style={styles.editAlarm}>
        <TopBarComponent
          navigation={navigation}
          onForwardPress={() => {
            handleGoForward()
          }}
          onBackPress={() => {
            navigation.goBack()
          }}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Title</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Title"
            textBreakStrategy={'simple'}
            underlineColorAndroid={'transparent'}
            autoCorrect
            onChangeText={(e) => {
              handleAlarmChange(e, 'title')
            }}
            value={alarm?.title}
          />
        </View>
        <View
          style={{ ...styles.inputContainer, ...styles.descriptionContainer }}
        >
          <Text style={styles.labelText}>Description</Text>
          <TextInput
            style={{ ...styles.inputText, ...styles.descriptionInputText }}
            placeholder="Description"
            multiline={true}
            textBreakStrategy={'simple'}
            underlineColorAndroid={'transparent'}
            autoCorrect
            onChangeText={(e) => {
              handleAlarmChange(e, 'description')
            }}
          >
            {alarm?.description}
          </TextInput>
        </View>
        <View style={styles.switchSection}>
          <View>
            <Text style={styles.switchLabel}>Is Active?</Text>
            <View style={styles.switchContainer}>
              <Switch
                style={styles.switch}
                thumbColor={
                  alarm?.isActive == true ? primaryDarkColor : primaryColor
                }
                trackColor={{ true: primaryColor }}
                onValueChange={(value) => {
                  handleAlarmChange(value, 'isActive')
                }}
                value={alarm?.isActive == true}
              />
            </View>
          </View>

          <View>
            <Text style={styles.switchLabel}>Is one ring only??</Text>
            <View style={styles.switchContainer}>
              <Switch
                style={styles.switch}
                thumbColor={
                  alarm?.isOneTime == true ? primaryDarkColor : primaryColor
                }
                trackColor={{ true: primaryColor }}
                onValueChange={(value) => {
                  handleAlarmChange(value, 'isOneTime')
                }}
                value={alarm?.isOneTime == true}
              />
            </View>
          </View>
        </View>
        <View>
          <DefaultButton
            title={'next'}
            onPress={() => {
              handleGoForward()
            }}
          />
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  editAlarm: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {},
  labelText: {
    marginTop: 10,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  inputText: {
    margin: 10,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  descriptionContainer: {
    flexGrow: 1,
  },
  descriptionInputText: {
    flexGrow: 1,
    verticalAlign: 'top',
  },
  switchSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  switchLabel: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switch: {
    margin: 10,
    marginTop: 0,
  },
})

export default EditAlarm
