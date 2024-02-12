import { FlatList } from "react-native-gesture-handler"
import Alarm from "../Models/Alarm"
import AlarmItemComponent from "./AlarmItemComponent"

interface AlarmListComponentProps {
    alarms: Alarm[],
    onEditClick: (alarm: Alarm) => void,
    onDeleteClick: (alarm: Alarm) => void
}

const AlarmListComponent = ({alarms, onEditClick, onDeleteClick}: AlarmListComponentProps) => {
    return (
        <FlatList
            data={alarms}
            renderItem={({item, index}) => (
                <AlarmItemComponent
                    alarm={item}
                    onEditClick={(alarm) => onEditClick(alarm)}
                    onDeleteClick={(alarm) => onDeleteClick(alarm)}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
            />
    )
}

export default AlarmListComponent