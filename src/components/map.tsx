import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { iconPinRed, iconPinGreen, iconPinBlue } from './icons'

const Map = () => {
    const pins = [ // This is an array of objects with the coordinates of the pins
        { lat: 51.505, lng: -0.09, type: "riv" },
        { lat: 51.51, lng: -0.1, type: "bygg" },
        { lat: 51.51, lng: -0.12, type: "annat" },
    ]

    // const handleIcons = () => {
    //     return pins.map((pin, i) => {
    //         switch (pin.type) {
    //             case "riv":
    //                 return iconPinRed
    //             case "bygg":
    //                 return iconPinBlue
    //             default:
    //                 return iconPinGreen
    //         }
    //     })
    // }

    const getAllPins = () => {
        return pins.map((pin, i) => {
            return (
                <Marker key={i} position={[pin.lat, pin.lng]} icon={
                    pin.type === "riv" ? iconPinRed :
                        pin.type === "bygg" ? iconPinBlue :
                            iconPinGreen
                }>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable. Type: {pin.type}.
                    </Popup>
                </Marker>
            )
        }
        )
    }

    var southWest = L.latLng(50, -20),
        northEast = L.latLng(72, 60),
        bounds = L.latLngBounds(southWest, northEast);

    return (
        <>
            <MapContainer center={[51.505, -0.09]} zoom={13} maxZoom={13} minZoom={3} maxBounds={bounds} style={{ height: "100vh", width: "100%" }} zoomControl={false}>
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
