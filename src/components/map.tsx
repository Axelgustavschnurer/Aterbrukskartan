import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { iconPinRed, iconPinGreen, iconPinBlue } from './icons'

export default function Map({currentFilter}) {
    const pins = [ // This is an array of objects with the coordinates of the pins
        { lat: 59.858227, lng: 17.632252, type: "rivning" },
        { lat: 59.857227, lng: 17.622252, type: "byggnad" },
        { lat: 59.858227, lng: 17.602252, type: "ombyggnad" },
    ]

    const getAllPins = () => {
        return pins.map((pin, i) => {
            return (
                <Marker key={i} position={[pin.lat, pin.lng]} icon={
                    pin.type === "rivning" ? iconPinRed :
                        pin.type === "byggnad" ? iconPinBlue :
                            iconPinGreen
                }>
                    <Popup>
                        Det här är ett {pin.type}s projekt. <br/> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at faucibus erat. Maecenas vel blandit tellus, sit amet ullamcorper neque. Vestibulum consectetur, enim quis cursus ultricies, neque purus aliquam massa, at vestibulum leo eros fringilla leo. Suspendisse potenti. Duis semper accumsan molestie. Cras pharetra enim sed eros mattis semper. Proin laoreet quam tellus, sed accumsan elit aliquet vitae. Maecenas ante massa, varius mollis ipsum sit amet, vulputate ultricies mauris. Nulla sit amet arcu non tortor ultrices posuere. Duis aliquam, justo ut imperdiet lobortis, odio tellus egestas dui, at fermentum libero leo ut lacus.
                    </Popup>
                </Marker>
            )
        }
        )
    }

    const handlePinFilter = ({currentFilter}) => {
        console.log(currentFilter)
    }

    var southWest = L.latLng(50, -20),
        northEast = L.latLng(72, 60),
        bounds = L.latLngBounds(southWest, northEast);

    return (
        <>
            <MapContainer center={[59.858227, 17.632252]} zoom={13} maxZoom={13} minZoom={5} maxBounds={bounds} style={{ height: "100vh", width: "100%" }} zoomControl={false}>
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