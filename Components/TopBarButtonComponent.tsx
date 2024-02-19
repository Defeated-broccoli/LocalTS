import { StackNavigationProp } from '@react-navigation/stack'
import {
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  TextStyle,
  Text,
} from 'react-native'
import { RootStackParamList } from '../NavigationProps/NavProps'
import { lightText } from '../Constants/constants'

interface TopBarButtonComponentProp {
  navigation: StackNavigationProp<RootStackParamList>
  containerStyle?: ViewStyle
  textStyle?: TextStyle
}

const TopBarButtonComponent = ({
  navigation,
  containerStyle,
  textStyle,
}: TopBarButtonComponentProp) => {
  return (
    <TouchableOpacity
      style={{
        ...containerStyle,
        ...styles.containerStyle,
        display: navigation.canGoBack() ? 'flex' : 'none',
      }}
      disabled={!navigation.canGoBack()}
      onPress={() => {
        navigation.goBack()
      }}
    >
      <Text style={{ ...textStyle, ...styles.textStyle }}>{'<'}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    margin: 5,
    width: 40,
    borderRightWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: lightText,
  },
  visibilityFalse: {
    display: 'none',
  },
})

export default TopBarButtonComponent
