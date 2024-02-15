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
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import dbConnection from '../Db/SQLite'
import {
  EditMapAlarmScreenNavigationProp,
  EditMapAlarmScreenRouteProp,
} from '../NavigationProps/NavProps'
import { Alarm, AlarmLocation } from '../Models/Alarm'
import TopBarComponent from '../Components/TopBarComponent'
import DefaultButton from '../Components/DefaultButton'

type EditMapAlarmProp = {
  route: EditMapAlarmScreenRouteProp
  navigation: EditMapAlarmScreenNavigationProp
}

const EditMapAlarm: React.FC<EditMapAlarmProp> = ({ route, navigation }) => {
  const [alarm, setAlarm] = useState<Alarm>(route.params.alarm)

  useEffect(() => {
    console.log(alarm)

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
        <SafeAreaView
          style={styles.editMapAlarm}
        >
          <MapView
            style={styles.map}
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
            onRegionChangeComplete={() => {}}
          >
            <Circle
              center={{
                latitude: alarm.location?.lat,
                longitude: alarm.location?.lon,
              }}
              radius={(alarm.location?.rangeKm ?? 0.5) * 1000}
              strokeWidth={1}
              strokeColor={'#1a66ff'}
              fillColor={'rgba(220,238,255,0.5)'}
            />
          </MapView>
          <View style={styles.bottomContainer}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                marginTop: 5,
                marginLeft: 20,
              }}
            >
              {alarm.location?.rangeKm ?? 0.5}km
            </Text>
            <MultiSlider
              containerStyle={{
                alignSelf: 'center',
              }}
              min={0.5}
              max={50}
              step={0.1}
              onValuesChange={(range) => {
                setAlarm((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    rangeKm: Math.round(range[0] * 10) / 10,
                  },
                }))
              }}
              onValuesChangeFinish={(value) => {}}
              values={[alarm.location?.rangeKm ?? 0.5]}
            />
          </View>
          <DefaultButton
            title='save'
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
     flexGrow: 1 
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
    zIndex: 5
  },

})

export default EditMapAlarm
