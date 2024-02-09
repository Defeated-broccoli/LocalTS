import { View, Text, SafeAreaView, Button } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { useState, useEffect } from 'react'

import dbConnection from '../db/SQLite'
import Alarm from '../Models/Alarm'

const Home = ({navigation, route}) => {
    const [alarms, setAlarms] = useState<Alarm[]>([])
    const isFocused = useIsFocused()

    useEffect(() => {
        dbConnection.getAlarms().then(result => setAlarms(result)).catch(error => console.log(error))
    }, [isFocused])

    const handleAlarmDelete = (alarm: Alarm) => {
        setAlarms(prev => {
            dbConnection.deleteAlarm(alarm).then().catch(error => console.log(error))
            return prev.filter(a => a.id !== alarm.id)
        })
    }

    return (
        <>
        <SafeAreaView style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            
        </SafeAreaView>
    </>
    )
}
    
export default Home
    