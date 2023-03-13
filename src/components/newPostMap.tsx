import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed } from './icons'
import React, { useState, useEffect, useRef, useMemo, useCallback, useContext } from 'react'

// Map component for "New Post" page



export default function NewPostMap({ setLat, setLon, lat, lon }: any) {
    // Declares default position of the marker
    const defaultPos = { lat: 59.85599174491208, lng: 17.640352062197294 }

    // const [position, setPosition] = useState(defaultPos)

    // Declares bounds of the map
    var southWest = L.latLng(50, -20),
        northEast = L.latLng(72, 60),
        bounds = L.latLngBounds(southWest, northEast);

    // Declares state of the marker position

    // Declares funtion to get coordinates of the marker
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
            async dragend() {
                const marker: any = markerRef.current
                if (marker != null) {
                    // setPosition(marker.getLatLng())
                    // await navigator.clipboard.writeText(`${marker.getLatLng().lat.toFixed(6)}, ${marker.getLatLng().lng.toFixed(6)}`)
                    // marker.openPopup()
                    setLat(marker.getLatLng().lat.toFixed(6))
                    setLon(marker.getLatLng().lng.toFixed(6))
                }
            },
        }),
        [],
    )
    useEffect(() => {
        console.log("markerRef.current", markerRef.current)
    }, [markerRef.current])

    // Returns map with red marker pin
    return (
        <>
            <MapContainer center={!lat && !lon ? defaultPos : [lat, lon]} zoom={13} maxZoom={16} minZoom={5} maxBounds={bounds} style={{ height: "90vh", width: "100%" }} zoomControl={false} >
                <ZoomControl position="bottomright" />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    eventHandlers={eventHandlers}
                    position={!lat && !lon ? defaultPos : [lat, lon]}
                    icon={IconPinRed}
                    draggable={true}
                    ref={markerRef}
                >
                    <Popup>
                        <span>Koordinater kopierade</span>
                    </Popup>
                </Marker>
            </MapContainer>
        </>
    )
}