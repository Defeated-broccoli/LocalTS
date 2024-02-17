import { FlatList } from 'react-native-gesture-handler'
import { Alarm } from '../Models/Alarm'
import {
  AlarmItemComponent,
  AlarmItemBackgroundComponent,
} from './AlarmItemComponent'
import { SwipeListView } from 'react-native-swipe-list-view'
import {
  View,
  Text,
  Dimensions,
  Animated,
  ViewStyle,
  StyleSheet,
} from 'react-native'

interface AlarmListComponentProps {
  alarms: Alarm[]
  alarmListStyle?: ViewStyle
  onEditClick: (alarm: Alarm) => void
  onDeleteClick: (alarm: Alarm) => void
}

const AlarmListComponent = ({
  alarms,
  alarmListStyle,
  onEditClick,
  onDeleteClick,
}: AlarmListComponentProps) => {
  let animationIsRunning = false

  const rowTranslateAnimatedValues: Animated.Value[] = []

  const onSwipeValueChange = (key: string, value: number) => {
    if (value < -Dimensions.get('window').width / 2 && !animationIsRunning) {
      animationIsRunning = true
      rowTranslateAnimatedValues[key] = new Animated.Value(1)
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const alarm = alarms.find((item) => item.id === parseInt(key))
        onDeleteClick(alarm)
        animationIsRunning = false
      })
    } else if (
      value > Dimensions.get('window').width / 2 &&
      !animationIsRunning
    ) {
      animationIsRunning = true
      rowTranslateAnimatedValues[key] = new Animated.Value(1)
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const alarm = alarms.find((item) => item.id === parseInt(key))
        onEditClick(alarm)
        animationIsRunning = false
      })
    }
  }

  return (
    <SwipeListView
      style={{ ...styles.alarmListStyle, ...alarmListStyle }}
      data={alarms.map((alarm, i) => ({ key: alarm.id, value: alarm }))}
      renderItem={(data, rowMap) => (
        <AlarmItemComponent alarm={data.item.value} />
      )}
      renderHiddenItem={(data, rowMap) => <AlarmItemBackgroundComponent />}
      onSwipeValueChange={({ key, value }) => onSwipeValueChange(key, value)}
      //useNativeDriver={false}
    />
  )
}

const styles = StyleSheet.create({
  alarmListStyle: {},
})

export default AlarmListComponent
