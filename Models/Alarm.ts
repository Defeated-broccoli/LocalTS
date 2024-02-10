interface AlarmLocation {
  lat?: number
  lon?: number
  latDelta?: number
  lonDelta?: number
  rangeKm?: number
}

interface Alarm {
  id?: number
  title?: string
  description?: string
  location?: AlarmLocation
  isActive?: boolean
  isOneTime?: boolean
}

export { Alarm, AlarmLocation }
