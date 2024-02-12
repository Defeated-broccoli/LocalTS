import { View, Text } from "react-native"
import style from 'index.css'

interface TitleComponentArgs {
    title?: string
}

const TitleComponent = (args: TitleComponentArgs) => {
  return (
    <View
      style={{
        margin: 10,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
        }}
      >
        {args.title ?? 'LocAl'}
      </Text>
    </View>
  )
}

export default TitleComponent