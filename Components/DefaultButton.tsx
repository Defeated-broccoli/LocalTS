import {
  ViewStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native'
import {
  lightText,
  primaryDarkColor,
  basicShadow,
} from '../Constants/constants'
import { useFonts } from 'expo-font'

interface DefaultButtonProps {
  title: string
  disabled?: boolean
  defaultButtonStyle?: ViewStyle
  textStyle?: TextStyle
  onPress?: (e: GestureResponderEvent) => void
  onLongPress?: (e: GestureResponderEvent) => void
}

const DefaultButton = ({
  title,
  disabled = false,
  defaultButtonStyle,
  textStyle,
  onPress,
  onLongPress,
}: DefaultButtonProps) => {
  const [fontsLoaded, fontError] = useFonts({
    'StickNoBills-ExtraBold': require('../assets/fonts/StickNoBills-ExtraBold.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <TouchableOpacity
      style={{ ...styles.defaultButtonStyle, ...defaultButtonStyle }}
      onPress={(e) => onPress(e)}
      onLongPress={(e) => onLongPress(e)}
      disabled={disabled}
    >
      <Text
        style={{
          ...styles.textStyle,
          ...textStyle,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  defaultButtonStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: primaryDarkColor,
    borderRadius: 10,
    margin: 10,
    padding: 5,
    ...basicShadow,
  },
  textStyle: {
    color: lightText,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'StickNoBills-ExtraBold',
    fontSize: 18,
  },
})

export default DefaultButton
