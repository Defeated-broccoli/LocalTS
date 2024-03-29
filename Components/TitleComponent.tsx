import {
  View,
  StyleSheet,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native'
import { lightText } from '../Constants/constants'

interface TitleComponentProp {
  containerStyle?: ViewStyle
  textStyle?: TextStyle
  imageStyle?: ImageStyle
}

const TitleComponent = ({
  containerStyle,
  textStyle,
  imageStyle,
}: TitleComponentProp) => {
  return (
    <View style={{ ...styles.containerStyle, ...containerStyle }}>
      {/* <Text style={{ ...styles.textStyle, ...textStyle }}>Lo</Text>
      <Image style={{...styles.imageStyle, ...imageStyle}} source={require('../assets/img/local-icon.png')}/> 
      <Text style={{ ...styles.textStyle, ...textStyle }}>cal</Text>  */}
      <Image
        style={{ ...styles.imageStyle, ...imageStyle }}
        source={require('../assets/img/logo.png')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 40,
    color: lightText,
  },
  imageStyle: {
    margin: 5,
    height: 40,
    objectFit: 'contain',
  },
})

export default TitleComponent
