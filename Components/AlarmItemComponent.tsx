import { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Alarm } from "../Models/Alarm"
import { SwipeRow } from "react-native-swipe-list-view"
import MapView, { MapCallout } from "react-native-maps"
import { lightBlue } from "../Constants/constants"

interface AlarmItemComponentsProps {
    alarm: Alarm,
    onEditClick: (alarm: Alarm) => void,
    onDeleteClick: (alarm: Alarm) => void
}

const AlarmItemComponent = ({ alarm, onEditClick, onDeleteClick }: AlarmItemComponentsProps) => {
    return (
      <View style={styles.itemComponent}>
        <View style={styles.textContainer}>
            <Text style={styles.titleText}>{alarm.title}</Text>
            <Text style={styles.descriptionText}>{alarm.description}</Text>
        </View>
        <View style={styles.mapContainer}>
            <MapView style={styles.map}
            showsCompass={false}
            zoomEnabled={false}
            zoomTapEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            toolbarEnabled={false}
            //map padding gets rid of google logo
            mapPadding={{top: 0, left: 0, bottom: 300, right: 0}}
            initialRegion={{
                latitude: alarm.location?.lat,
                longitude: alarm.location?.lon,
                latitudeDelta: alarm.location?.latDelta,
                longitudeDelta: alarm.location?.lonDelta
            }}/>
        </View>
      </View>
    )
}

const AlarmItemBackgroundComponent = () => {
    return (
        <View style={styles.backgroundItemComponent}>
            <View style={styles.backgroundDeleteView}></View>
            <View style={styles.backgroundEditView}></View>
        </View>
    )
}

const styles = StyleSheet.create({
  itemComponent: {
    margin: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    backgroundColor: lightBlue
    
  },
  mapContainer: {
    overflow: 'hidden',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftWidth: 1
    
  },
  map: {
    width: 100,
    height: 100,
  },
  textContainer: {
    margin: 5
  },
  titleText: {
    fontWeight: 'bold',
    maxWidth: '70%'
  },
  descriptionText: {

  },

  backgroundItemComponent: {
    margin: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    overflow: 'hidden'
    
  },
  backgroundDeleteView: {
    backgroundColor: 'red',
    width: '50%'
  },
  backgroundEditView: {
    backgroundColor: 'blue',
    width: '50%'
  }
});

export  {AlarmItemComponent, AlarmItemBackgroundComponent}