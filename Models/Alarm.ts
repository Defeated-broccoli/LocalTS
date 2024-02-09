interface Alarm {
    id: number,
    title: string,
    description: string,
    rangeKm: number,
    lat: number,
    lon: number,
    isActive: boolean,
    isOneTime: boolean
}

export default Alarm