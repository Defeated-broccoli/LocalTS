import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native'
import { Alarm } from '../Models/Alarm'
import MapView from 'react-native-maps'
import {
  primaryColor,
  secondaryColor,
  detailColor,
  darkText,
  basicShadow,
  primaryDarkColor,
  lightText,
  primaryRgbaDarkColor,
  secondaryRgbaDarkColor,
} from '../Constants/constants'
import { useFonts } from 'expo-font'
import { SwipeRow } from 'react-native-swipe-list-view'
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  Swipeable,
} from 'react-native-gesture-handler'
import { useRef } from 'react'

interface AlarmItemComponentsProps {
  alarm: Alarm
  handleEditAlarm: (alarm: Alarm) => void
  handleDeleteAlarm: (alarm: Alarm) => void
}

const AlarmItemComponent = ({
  alarm,
  handleEditAlarm,
  handleDeleteAlarm,
}: AlarmItemComponentsProps) => {
  const [fontsLoaded, fontError] = useFonts({
    'StickNoBills-SemiBold': require('../assets/fonts/StickNoBills-SemiBold.ttf'),
    'StickNoBills-Regular': require('../assets/fonts/StickNoBills-Regular.ttf'),
  })

  let offsetValue: number = 0
  const handleRowSwipe = (value: number) => {
    offsetValue = value
    swipeElement(value, 10)
  }

  const handleRowEnded = () => {
    if (offsetValue > Dimensions.get('window').width / 2) {
      console.log('edit')
      handleEditAlarm(alarm)
      swipeElement(0, 0)
    } else if (offsetValue < -Dimensions.get('window').width / 2) {
      console.log('delete')
      swipeElement(-1000, 500)
      deleteElement()
      handleDeleteAlarm(alarm)
    } else {
      backElement()
    }
  }

  const swipeAnimate = useRef(new Animated.Value(0)).current
  const heightAnimate = useRef(new Animated.Value(100)).current

  const interpolateBackgroundColor = swipeAnimate.interpolate({
    inputRange: [
      -Dimensions.get('window').width / 2,
      0,
      Dimensions.get('window').width / 2,
    ],
    outputRange: [
      secondaryRgbaDarkColor,
      'rgba(0, 0, 0, 0)',
      primaryRgbaDarkColor,
    ],
  })

  const interpolateRightColor = swipeAnimate.interpolate({
    inputRange: [0, Dimensions.get('window').width / 2],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
  })

  const interpolateLeftColor = swipeAnimate.interpolate({
    inputRange: [-Dimensions.get('window').width / 2, 0],
    outputRange: ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)'],
  })

  const interpolateMargin = heightAnimate.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 10],
  })

  const swipeElement = (value: number, duration: number) => {
    Animated.timing(swipeAnimate, {
      toValue: value,
      duration: duration,
      useNativeDriver: false,
    }).start()
  }

  const backElement = () => [
    Animated.timing(swipeAnimate, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(),
  ]

  const deleteElement = () => [
    Animated.timing(heightAnimate, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(),
  ]

  const swipeStyle = {
    left: swipeAnimate,
  }

  const backgroundColorStyle = {
    backgroundColor: interpolateBackgroundColor,
  }

  const rightColorStyle = {
    color: interpolateRightColor,
  }

  const leftColorStyle = {
    color: interpolateLeftColor,
  }

  const heightStyle = {
    height: heightAnimate,
  }

  const marginStyle = {
    margin: interpolateMargin,
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <PanGestureHandler
      onGestureEvent={(e) => handleRowSwipe(e.nativeEvent.translationX)}
      onEnded={(e) => handleRowEnded()}
    >
      <Animated.View style={[styles.itemComponent, swipeStyle, heightStyle]}>
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
        <Animated.View
          style={[styles.animationView, backgroundColorStyle, heightStyle]}
        >
          <Animated.Text style={[styles.animationText, leftColorStyle]}>
            DELETE
          </Animated.Text>
          <Animated.Text style={[styles.animationText, rightColorStyle]}>
            EDIT
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  )
}

const styles = StyleSheet.create({
  itemComponent: {
    height: 100,
    margin: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 50,
  },
  mapContainer: {
    overflow: 'hidden',
    borderRadius: 50,
  },
  map: {
    width: 100,
    height: 100,
  },
  textContainer: {
    margin: 10,
    maxWidth: '65%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
  animationView: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 100,
    width: '100%',
    flex: 1,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animationText: {
    textAlign: 'center',
    fontFamily: 'StickNoBills-SemiBold',
    fontSize: 56,
    marginLeft: 20,
    marginRight: 20,
  },
})

export { AlarmItemComponent }
