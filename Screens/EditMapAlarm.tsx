import { useState, useEffect } from 'react'
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import MapView, { Circle, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import Toast from 'react-native-root-toast'

import dbConnection from '../Db/SQLite'
import {
  EditMapAlarmScreenNavigationProp,
  EditMapAlarmScreenRouteProp,
} from '../NavigationProps/NavProps'
import { Alarm, AlarmLocation } from '../Models/Alarm'
import TopBarComponent from '../Components/TopBarComponent'
import DefaultButton from '../Components/DefaultButton'
import Slider from '@react-native-community/slider'
import {
  primaryColor,
  primaryDarkColor,
  primaryRgbaColorAlpha03,
} from '../Constants/constants'
import { useFonts } from 'expo-font'

type EditMapAlarmProp = {
  route: EditMapAlarmScreenRouteProp
  navigation: EditMapAlarmScreenNavigationProp
}

const EditMapAlarm: React.FC<EditMapAlarmProp> = ({ route, navigation }) => {
  const [alarm, setAlarm] = useState<Alarm>(route.params.alarm)

  const [fontsLoaded, fontError] = useFonts({
    'StickNoBills-ExtraBold': require('../assets/fonts/StickNoBills-ExtraBold.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  useEffect(() => {
    if (alarm.location?.lat == null) {
      getInitialRegion()
        .then((result) => {
          setAlarm((prev) => ({
            ...prev,
            location: result,
          }))
        })
        .catch((e) => console.log(e))
    }
  }, [])

  const getInitialRegion = async (): Promise<AlarmLocation> => {
    return new Promise(async (resolve, reject) => {
      let result = await Location.requestForegroundPermissionsAsync()

      if (!result.granted) {
        reject({ status: result, message: 'Permission not granted' })
      }

      const loc = await Location.getLastKnownPositionAsync()

      resolve({
        lat: loc?.coords?.latitude ?? 0,
        lon: loc?.coords?.longitude ?? 0,
        latDelta: 1,
        lonDelta: 1,
        rangeKm: 0.5,
      })
    })
  }

  const handleSaveButton = () => {
    if (alarm.id == null) {
      dbConnection
        .addAlarm(alarm)
        .then((result) => {
          Toast.show('Added new alarm')
          navigation.navigate('Home')
        })
        .catch((e) => {
          Toast.show(`Failed to add an alarm, ${e}`)
        })
    } else {
      dbConnection
        .updateAlarm(alarm)
        .then((result) => {
          Toast.show(`Alarm with id: ${alarm.id} has been edited`)
          navigation.navigate('Home')
        })
        .catch((e) => {
          Toast.show(`Failed to add an alarm, ${e}`)
        })
    }
  }

  return (
    <>
      {alarm?.location?.lat != null && (
        <SafeAreaView style={styles.editMapAlarm}>
          <TopBarComponent
            navigation={navigation}
            onForwardPress={() => {
              handleSaveButton()
            }}
            onBackPress={
              navigation.canGoBack
                ? () => {
                    navigation.goBack()
                  }
                : null
            }
          />
          <MapView
            style={styles.map}
            tintColor={primaryDarkColor}
            initialRegion={{
              latitude: alarm.location?.lat,
              longitude: alarm.location?.lon,
              latitudeDelta: alarm.location?.latDelta,
              longitudeDelta: alarm.location?.lonDelta,
            }}
            onRegionChange={(region) => {
              setAlarm((prev) => ({
                ...prev,
                location: {
                  lat: region.latitude,
                  lon: region.longitude,
                  latDelta: region.latitudeDelta,
                  lonDelta: region.longitudeDelta,
                  rangeKm: prev.location?.rangeKm,
                },
              }))
            }}
            showsUserLocation={true}
          >
            <Circle
              center={{
                latitude: alarm.location?.lat,
                longitude: alarm.location?.lon,
              }}
              radius={(alarm.location?.rangeKm ?? 0.5) * 1000}
              strokeWidth={1}
              strokeColor={primaryDarkColor}
              fillColor={primaryRgbaColorAlpha03}
            />
          </MapView>
          <View style={{ ...styles.bottomContainer }}>
            <Text style={styles.sliderLabel}>
              {alarm.location?.rangeKm ?? 0.5}km
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={50}
              thumbTintColor={primaryDarkColor}
              minimumTrackTintColor={primaryColor}
              step={0.5}
              onValueChange={(range) => {
                setAlarm((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    rangeKm: Math.round(range * 10) / 10,
                  },
                }))
              }}
              value={alarm.location?.rangeKm ?? 0.5}
            />
            <DefaultButton
              title="save"
              onPress={() => {
                handleSaveButton()
              }}
            />
          </View>
        </SafeAreaView>
      )}

      {alarm?.location?.lat == null && <Text>Loading...</Text>}
    </>
  )
}

const styles = StyleSheet.create({
  editMapAlarm: {
    flex: 1,
  },
  map: {
    width: '100%',
    flexGrow: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '94%',
    zIndex: 5,
  },
  sliderLabel: {
    fontSize: 16,
    marginTop: 5,
    marginLeft: 20,
    fontFamily: 'StickNoBills-ExtraBold',
  },
  slider: {
    height: 50,
  },
})

export default EditMapAlarm
