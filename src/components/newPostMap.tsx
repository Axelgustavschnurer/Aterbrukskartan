import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed } from './icons'
import React, { useEffect, useRef, useMemo } from 'react'

// Map component for "New Post" page
export default function NewPostMap({ setLat, setLon, lat, lon, defaultLat = 59.85599174491208, defaultLon = 17.640352062197294 }: any) {
    // Declares bounds of the map
    var southWest = L.latLng(50, -20),
        northEast = L.latLng(72, 60),
        bounds = L.latLngBounds(southWest, northEast);

    // Declares funtion to get coordinates of the marker
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
            async dragend() {
                const marker: any = markerRef.current
                if (marker != null) {
                    marker.openPopup()
                    // Sets the coordinates of the marker to the state that is passed to the component from the parent component
                    setLat(marker.getLatLng().lat.toFixed(6))
                    setLon(marker.getLatLng().lng.toFixed(6))
                }
            },
        }),
        [setLat, setLon],
    )

    // Returns map with red marker pin
    return (
        <>
            <MapContainer center={!lat && !lon ? [defaultLat, defaultLon] : [lat, lon]} zoom={13} maxZoom={16} minZoom={5} maxBounds={bounds} style={{ height: "90vh", width: "100%", borderRadius: '.5em' }} zoomControl={false} >
                <ZoomControl position="bottomright" />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    eventHandlers={eventHandlers}
                    position={!lat && !lon ? [defaultLat, defaultLon] : [lat, lon]}
                    icon={IconPinRed}
                    draggable={true}
                    ref={markerRef}
                >
                    <Popup>
                        <span>Platsen har sparats</span>
                    </Popup>
                </Marker>
            </MapContainer>
        </>
    )
}