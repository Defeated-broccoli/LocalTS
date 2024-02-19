import React from 'react'
import { View, StyleSheet, Text, ViewStyle } from 'react-native'

import { NavigationAction, NavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import {
  HomeScreenNavigationProp,
  RootStackParamList,
} from '../NavigationProps/NavProps'
import { TouchableOpacity } from 'react-native-gesture-handler'
import TitleComponent from './TitleComponent'
import TopBarButtonComponent, { BarButtonTypes } from './TopBarButtonComponent'
import {
  basicShadow,
  detailColor,
  primaryDarkColor,
} from '../Constants/constants'

interface TopBarComponentProps {
  navigation: StackNavigationProp<RootStackParamList>
  onForwardPress?: () => void
  onBackPress?: () => void
}

const TopBarComponent = ({
  navigation,
  onForwardPress = null,
  onBackPress = null,
}: TopBarComponentProps) => {
  return (
    <View style={styles.topBar}>
      <TopBarButtonComponent
        navigation={navigation}
        onPress={() => onBackPress()}
        disabled={!onBackPress}
        barButtonType={BarButtonTypes.BACK}
      />
      <View style={styles.titleView}>
        <TitleComponent />
      </View>
      <TopBarButtonComponent
        navigation={navigation}
        onPress={() => onForwardPress()}
        disabled={!onForwardPress}
        barButtonType={BarButtonTypes.FORWARD}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: primaryDarkColor,
    ...basicShadow,
  },
  titleView: {
    width: '100%',
    flex: 1,
  },
})

export default TopBarComponent
