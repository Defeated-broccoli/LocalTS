import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'
import { Asset } from 'expo-asset'
import { Alarm } from '../Models/Alarm'

interface DatabaseResult {
  result?: boolean
  message?: string | number
}

const openDbConnection = (): SQLite.SQLiteDatabase => {
  const db = SQLite.openDatabase('LocAl.db')

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS alarms (id INTEGER PRIMARY KEY NOT NULL,title TEXT,description TEXT,rangeKm REAL,lat REAL,lon REAL, latDelta REAL, lonDelta REAL, isActive BOOLEAN, isOneTime BOOLEAN );`,
      [],
      (_, result) => {
        //console.log('Table created: ', result)
      },
      (_, error) => {
        console.error('Table creation failed: ', error)
        return false
      }
    )
  })
  return db
}

const getAlarms = async (): Promise<Alarm[]> => {
  const db = openDbConnection()

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * from alarms',
        [],
        (_, { rows: { _array } }) => {
          resolve(
            _array.map<Alarm>(
              (row) =>
                ({
                  id: row.id,
                  title: row.title,
                  description: row.description,
                  location: {
                    lat: row.lat,
                    lon: row.lon,
                    latDelta: row.latDelta,
                    lonDelta: row.lonDelta,
                    rangeKm: row.rangeKm,
                  },
                  isActive: row.isActive > 0,
                  isOneTime: row.isOneTime > 0,
                } as Alarm)
            )
          )
        },
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
}

const addAlarm = async (alarm: Alarm): Promise<DatabaseResult> => {
  const db = openDbConnection()

  return new Promise((resolve, reject: (dbResult: DatabaseResult) => void) => {
    db.transaction((tx) => {
      tx.executeSql(
        'insert into alarms (title, description, rangeKm, lat, lon, latDelta, lonDelta, isActive, isOneTime) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          alarm.title,
          alarm.description,
          alarm.location?.rangeKm,
          alarm.location?.lat,
          alarm.location?.lon,
          alarm.location?.latDelta,
          alarm.location?.lonDelta,
          alarm.isActive ? 1 : 0,
          alarm.isOneTime ? 1 : 0,
        ],
        (_, res) => {
          resolve({ result: true, message: res.rowsAffected })
        },
        (_, error) => {
          reject({ result: false, message: error.message })
          return false
        }
      )
    })
  })
}

const updateAlarm = async (alarm: Alarm): Promise<DatabaseResult> => {
  const db = openDbConnection()

  return new Promise(
    (resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
      db.transaction((tx) => {
        tx.executeSql(
          'update alarms set title = ?, description = ?, rangeKm = ?, lat = ?, lon = ?, latDelta = ?, lonDelta = ?, isActive = ?, isOneTime = ? where id = ?',
          [
            alarm.title,
            alarm.description,
            alarm.location?.rangeKm,
            alarm.location?.lat,
            alarm.location?.lon,
            alarm.location?.latDelta,
            alarm.location?.lonDelta,
            alarm.isActive ? 1 : 0,
            alarm.isOneTime ? 1 : 0,
            alarm.id,
          ],
          (_, res) => {
            resolve({ result: true, message: res.rowsAffected })
          },
          (_, error) => {
            reject({ result: false, message: error.message })
            return false
          }
        )
      })
    }
  )
}

const deleteAlarm = async (alarm: Alarm) => {
  const db = openDbConnection()

  return new Promise(
    (resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
      db.transaction((tx) => {
        tx.executeSql(
          'delete from alarms where id = ?',
          [alarm.id],
          (_, res) => {
            resolve({ result: true, message: res.rowsAffected })
          },
          (_, error) => {
            reject({ result: false, message: error.message })
            return false
          }
        )
      })
    }
  )
}

export default {
  openDbConnection,
  getAlarms,
  addAlarm,
  updateAlarm,
  deleteAlarm,
}
