import { StackNavigationProp } from '@react-navigation/stack'
import {
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  TextStyle,
  Text,
  Image,
  ImageStyle,
} from 'react-native'
import { RootStackParamList } from '../NavigationProps/NavProps'
import { lightText } from '../Constants/constants'

export enum BarButtonTypes {
  BACK,
  FORWARD,
}

interface TopBarButtonComponentProp {
  navigation: StackNavigationProp<RootStackParamList>
  barButtonType?: BarButtonTypes
  onPress: () => void
  disabled?: boolean
  containerStyle?: ViewStyle
  imageStyle?: ImageStyle
}

const TopBarButtonComponent = ({
  navigation,
  onPress,
  disabled = false,
  barButtonType,
  containerStyle,
  imageStyle,
}: TopBarButtonComponentProp) => {
  return (
    <TouchableOpacity
      style={{
        ...containerStyle,
        ...styles.containerStyle,
        display: !disabled ? 'flex' : 'none',
        borderRightWidth: barButtonType == BarButtonTypes.BACK ? 1 : 0,
        borderLeftWidth: barButtonType == BarButtonTypes.FORWARD ? 1 : 0,
      }}
      disabled={disabled}
      onPress={() => {
        onPress()
      }}
    >
      <Image
        source={require('../assets/bar-button.png')}
        style={{
          ...imageStyle,
          ...styles.imageStyle,
          transform:
            barButtonType == BarButtonTypes.BACK ? [{ scaleX: -1 }] : [],
        }}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    margin: 5,
    width: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: lightText,
  },
  imageStyle: {
    height: 40,
    objectFit: 'contain',
  },
  visibilityFalse: {
    display: 'none',
  },
})

export default TopBarButtonComponent
