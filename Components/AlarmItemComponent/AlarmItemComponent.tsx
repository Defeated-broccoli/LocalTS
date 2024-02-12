import { useState } from "react"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import {Alarm} from "../../Models/Alarm"

interface AlarmItemComponentsProps {
    alarm: Alarm,
    onEditClick: (alarm: Alarm) => void,
    onDeleteClick: (alarm: Alarm) => void
}

const AlarmItemComponent = ({ alarm, onEditClick, onDeleteClick }: AlarmItemComponentsProps) => {
    const [isEnlarged, setIsEnlarged] = useState<boolean>(false)

    return (
        <TouchableOpacity
      style={{
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'lightgrey',
        position: 'relative',
      }}
      onPress={() => {
        setIsEnlarged((prev) => !prev)
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            margin: 5,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
            }}
          >
            {alarm.title}
          </Text>
        </View>
        <View
          style={{
            margin: 5,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
            }}
          >
            {alarm?.location?.rangeKm} km
          </Text>
        </View>
      </View>
      {!isEnlarged && (
        <View
          style={{
            margin: 5,
          }}
        >
          <Text>down</Text>
        </View>
      )}
      {isEnlarged && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <View
            style={{
              margin: 10,
            }}
          >
            <Text>{alarm.description}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <TouchableOpacity
              style={{
                width: '30%',
                padding: 5,
                margin: 5,
                backgroundColor: 'blue',
                borderRadius: 5,
              }}
              onPress={() => {
                onEditClick(alarm)
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '30%',
                padding: 5,
                margin: 5,
                backgroundColor: 'red',
                borderRadius: 5,
              }}
              onPress={() => {
                onDeleteClick(alarm)
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
    )
}

export default AlarmItemComponent