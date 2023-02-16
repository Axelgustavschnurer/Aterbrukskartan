import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const Map = () => {
    const pins = [ // This is an array of objects with the coordinates of the pins
        { lat: 51.505, lng: -0.09 },
        { lat: 51.51, lng: -0.1 },
        { lat: 51.51, lng: -0.12 },
    ]

    const icon = new L.Icon({
        iconUrl: 'https://www.galeo.com.mx/wp-content/uploads/2016/06/map-marker-icon.png',
        iconRetinaUrl: '/marker-icon-2x.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [25, 25],
    });

    const getAllPins = () => {
        return pins.map((pin, i) => {
            return (
                <Marker key={i} position={[pin.lat, pin.lng]} icon={icon}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            )
        }
        )
    }
    console.log(getAllPins())
    return (
        <>
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }} zoomControl={false}>
                <ZoomControl position="bottomright" />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {getAllPins()}
            </MapContainer>
        </>
    )
}

export default Map
