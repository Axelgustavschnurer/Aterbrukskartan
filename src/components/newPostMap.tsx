import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed } from './icons'
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'

// Map component for "New Post" page


export default function NewPostMap() {
    // Declares default position of the marker
    const defaultPos = { lat: 59.85599174491208, lng: 17.640352062197294 }

    const [position, setPosition] = useState(defaultPos)
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
                const marker = markerRef.current
                if (marker != null) {
                    // setPosition(marker.getLatLng())
                    console.log("Get LatLng", marker.getLatLng())
                    setPosition(marker.getLatLng())
                    await navigator.clipboard.writeText(`${marker.getLatLng().lat.toFixed(6)}, ${marker.getLatLng().lng.toFixed(6)}`)
                    marker.openPopup()
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
            <MapContainer center={defaultPos} zoom={13} maxZoom={16} minZoom={5} maxBounds={bounds} style={{ height: "90vh", width: "100%" }} zoomControl={false} >
                <ZoomControl position="bottomright" />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    eventHandlers={eventHandlers}
                    position={position}
                    icon={IconPinRed}
                    draggable={true}
                    animate={true}
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