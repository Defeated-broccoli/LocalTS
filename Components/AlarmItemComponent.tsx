import { View, Text, StyleSheet, Image } from 'react-native'
import { Alarm } from '../Models/Alarm'
import MapView from 'react-native-maps'
import {
  primaryColor,
  secondaryColor,
  detailColor,
  darkText,
  basicShadow,
  primaryDarkColor,
} from '../Constants/constants'
import { useFonts } from 'expo-font'

interface AlarmItemComponentsProps {
  alarm: Alarm
}

const AlarmItemComponent = ({ alarm }: AlarmItemComponentsProps) => {
  const [fontsLoaded, fontError] = useFonts({
    'StickNoBills-SemiBold': require('../assets/fonts/StickNoBills-SemiBold.ttf'),
    'StickNoBills-Regular': require('../assets/fonts/StickNoBills-Regular.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.itemComponent}>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          {alarm.title.length > 30
            ? alarm.title.slice(0, 30) + '...'
            : alarm.title}
        </Text>
        <Text style={styles.descriptionText}>
          {alarm.description.length > 90
            ? alarm.description.slice(0, 90) + '...'
            : alarm.description}
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          showsCompass={false}
          zoomEnabled={false}
          zoomTapEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          toolbarEnabled={false}
          //map padding gets rid of google logo
          mapPadding={{ top: 0, left: 0, bottom: 300, right: 0 }}
          initialRegion={{
            latitude: alarm.location?.lat,
            longitude: alarm.location?.lon,
            latitudeDelta: alarm.location?.latDelta,
            longitudeDelta: alarm.location?.lonDelta,
          }}
        />
      </View>
    </View>
  )
}

const AlarmItemBackgroundComponent = () => {
  return (
    <View style={styles.backgroundItemComponent}>
      <Image
        style={{ ...styles.backgroundEditImage, ...styles.backgroundImage }}
        source={require('../assets/img/pen.png')}
      ></Image>
      <Image
        style={{ ...styles.backgroundDeleteImage, ...styles.backgroundImage }}
        source={require('../assets/img/delete.png')}
      ></Image>
    </View>
  )
}

const styles = StyleSheet.create({
  itemComponent: {
    height: 100,
    margin: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    backgroundColor: detailColor,
    ...basicShadow,
  },
  mapContainer: {
    overflow: 'hidden',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftWidth: 1,
  },
  map: {
    width: 100,
    height: 100,
  },
  textContainer: {
    margin: 10,
    maxWidth: '65%',
  },
  titleText: {
    fontFamily: 'StickNoBills-SemiBold',
  },
  descriptionText: {
    fontFamily: 'StickNoBills-Regular',
  },
  backgroundItemComponent: {
    margin: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: 50,
    height: 50,
    margin: 10,
    alignSelf: 'center',
  },
  backgroundDeleteImage: {},
  backgroundEditImage: {},
})

export { AlarmItemComponent, AlarmItemBackgroundComponent }
