import { View, Text, StyleSheet, Image, ViewStyle, TextStyle, ImageStyle } from "react-native"

interface TitleComponentProp {
    containerStyle?: ViewStyle,
    textStyle?: TextStyle,
    imageStyle?: ImageStyle
}

const TitleComponent = ({containerStyle, textStyle, imageStyle}: TitleComponentProp) => {
  return (
    <View
      style={{...styles.containerStyle, ...containerStyle}}
    >
      <Text style={{...styles.textStyle, ...textStyle}}>L</Text>
      <Image style={{...styles.imageStyle, ...imageStyle}} source={require('../assets/local-icon.png')}/>
      <Text style={{...styles.textStyle, ...textStyle}}>cal</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  imageStyle: {
    width: 26,
    height: 26,
    marginTop: 8
  }

})


export default TitleComponent