import {
  ViewStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native'
import {
  primaryColor,
  secondaryColor,
  lightText,
  primaryDarkColor,
  basicShadow,
} from '../Constants/constants'
import { useState } from 'react'

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
  return (
    <TouchableOpacity
      style={{ ...styles.defaultButtonStyle, ...defaultButtonStyle }}
      onPress={(e) => onPress(e)}
      onLongPress={(e) => onLongPress(e)}
    >
      <Text style={{ ...styles.textStyle, ...textStyle }}>{title}</Text>
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
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
})

export default DefaultButton
