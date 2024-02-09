import { StatusBar } from 'expo-status-bar';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native' 
import { createStackNavigator } from '@react-navigation/stack'

import Home from './Screens/Home'

const Stack = createStackNavigator()

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
      {/* <StatusBar style={'auto'} hidden={true}/> */}
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}



