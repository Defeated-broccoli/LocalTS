interface AlarmLocation {
  lat: number
  lon: number
  rangeKm?: number
}

interface Alarm {
  id: number
  title: string
  description: string
  location: AlarmLocation
  isActive: boolean
  isOneTime: boolean
}

export { Alarm, AlarmLocation }
