import { useState, useEffect } from 'react'
import {
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import MapView, { Circle, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import Toast from 'react-native-root-toast'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import dbConnection from '../db/SQLite'
import {
  EditMapAlarmScreenNavigationProp,
  EditMapAlarmScreenRouteProp,
} from '../NavigationProps/NavProps'
import { Alarm, AlarmLocation } from '../Models/Alarm'

type EditMapAlarmProp = {
  route: EditMapAlarmScreenRouteProp
  navigation: EditMapAlarmScreenNavigationProp
}

interface MapLocation extends AlarmLocation {
  latDelta: number
  lonDelta: number
}

const EditMapAlarm: React.FC<EditMapAlarmProp> = ({ route, navigation }) => {
  const [alarm, setAlarm] = useState<Alarm>(route.params.alarm)
  const [mapLocation, setMapLocation] = useState<MapLocation>({
    ...route.params.alarm?.location,
    latDelta: 0.0822,
    lonDelta: 0.0421,
  })
  const [range, setRange] = useState(
    route.params.alarm?.location?.rangeKm ?? 0.5
  )
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (alarm?.location != null) {
      getInitialRegion()
        .then((loc) => {
          setMapLocation({
            ...loc,
            latDelta: 0.0822,
            lonDelta: 0.0421,
          })
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      setMapLocation({
        ...alarm.location,
        latDelta: 0.0822,
        lonDelta: 0.0421,
      })
    }
    setRefresh((prev) => prev + 1)
  }, [])

  useEffect(() => {
    setAlarm((prev) => ({
      ...prev,
      rangeKm: range,
      lat: mapLocation?.lat,
      lon: mapLocation?.lon,
    }))
  }, [refresh])

  const getInitialRegion = async (): Promise<AlarmLocation> => {
    return new Promise(async (resolve, reject) => {
      let result = await Location.requestForegroundPermissionsAsync()

      if (!result.granted) {
        reject({ status: result, message: 'Permission not granted' })
      }

      const loc = await Location.getLastKnownPositionAsync()

      resolve({ lat: loc.coords.latitude, lon: loc.coords.longitude })
    })
  }

  const handleSaveButton = () => {
    if (alarm.id === null) {
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
    <SafeAreaView>
      {mapLocation && (
        <>
          <View
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MapView
              style={{ width: '100%', flexGrow: 1 }}
              initialRegion={{
                latitude: mapLocation.lat,
                longitude: mapLocation.lon,
                latitudeDelta: mapLocation.latDelta,
                longitudeDelta: mapLocation.lonDelta,
              }}
              onRegionChange={(e) => {
                setMapLocation({
                  ...mapLocation,
                  lat: e.latitude,
                  lon: e.longitude,
                  latDelta: e.latitudeDelta,
                  lonDelta: e.longitudeDelta,
                })
              }}
              onRegionChangeComplete={() => {
                setRefresh((prev) => prev + 1)
              }}
            >
              <Circle
                center={{
                  latitude: mapLocation.lat,
                  longitude: mapLocation.lon,
                }}
                radius={mapLocation?.rangeKm ?? 0 * 1000}
                strokeWidth={1}
                strokeColor={'#1a66ff'}
                fillColor={'rgba(220,238,255,0.5)'}
              />
            </MapView>
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
                {range}km
              </Text>
              <MultiSlider
                containerStyle={{
                  alignSelf: 'center',
                }}
                min={0.5}
                max={50}
                step={0.1}
                onValuesChange={(value) => {
                  setRange(Math.round(value[0] * 10) / 10)
                }}
                onValuesChangeFinish={(value) => {
                  setRefresh((prev) => prev + 1)
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                margin: 10,
                padding: 10,
                backgroundColor: 'blue',
                borderRadius: 10,
              }}
              onPress={() => {
                handleSaveButton()
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: 'white',
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {!mapLocation && <Text>Loading...</Text>}
    </SafeAreaView>
  )
}

export default EditMapAlarm
