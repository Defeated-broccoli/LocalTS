
import {
  NavigationContainer,
  DefaultTheme,
  RouteProp,
} from '@react-navigation/native'
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack'

import Home from './Screens/Home'
import EditAlarm from './Screens/EditAlarm'
import { RootStackParamList } from './NavigationProps/NavProps'
import EditMapAlarm from './Screens/EditMapAlarm'
import { SafeAreaView, StatusBar } from 'react-native'

const Stack = createStackNavigator<RootStackParamList>()

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
}

export default function App() {
  return (
    <>
    <SafeAreaView style={{flex: 1}}>
    <StatusBar backgroundColor={'pink'} />
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="EditAlarm" component={EditAlarm} />
          <Stack.Screen name="EditMapAlarm" component={EditMapAlarm} />
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaView>
    </>
  )
}
