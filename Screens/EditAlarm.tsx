import React, { useRef, useState } from 'react'
import {
  EditAlarmScreenNavigationProp,
  EditAlarmScreenRouteProp,
} from '../NavigationProps/NavProps'
import {
  PanResponder,
  View,
  Text,
  TextInput,
  SafeAreaView,
  Switch,
  StyleSheet,
} from 'react-native'
import { Alarm } from '../Models/Alarm'
import TopBarComponent from '../Components/TopBarComponent'
import DefaultButton from '../Components/DefaultButton'
import { primaryColor, primaryDarkColor } from '../Constants/constants'
import { useFonts } from 'expo-font'

type EditAlarmProps = {
  route: EditAlarmScreenRouteProp
  navigation: EditAlarmScreenNavigationProp
}

const EditAlarm: React.FC<EditAlarmProps> = ({ navigation, route }) => {
  const [alarm, setAlarm] = useState<Alarm>(
    route.params.alarm ?? {
      title: '',
      description: '',
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

  const [fontsLoaded, fontError] = useFonts({
    'StickNoBills-ExtraBold': require('../assets/fonts/StickNoBills-ExtraBold.ttf'),
    'StickNoBills-Regular': require('../assets/fonts/StickNoBills-Regular.ttf'),
  })

  if (!fontsLoaded) {
    return null
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
    fontFamily: 'StickNoBills-ExtraBold',
  },
  inputText: {
    margin: 10,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    fontFamily: 'StickNoBills-Regular',
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
    fontFamily: 'StickNoBills-ExtraBold',
    fontSize: 20,
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    margin: 10,
    marginTop: 0,
    paddingRight: 10,
  },
})

export default EditAlarm
