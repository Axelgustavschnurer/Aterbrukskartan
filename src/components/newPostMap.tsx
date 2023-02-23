import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { iconPinRed, iconPinGreen, iconPinBlue } from './icons'
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { popupContent, popupHead, popupText, okText } from "./popupStyles";

export default function Map(currentFilter: any) {
    var southWest = L.latLng(50, -20),
        northEast = L.latLng(72, 60),
        bounds = L.latLngBounds(southWest, northEast);

    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    // setPosition(marker.getLatLng())
                    console.log("Get LatLng", marker.getLatLng())
                }
            },
        }),
        [],
    )
    useEffect(() => {
        console.log("markerRef.current", markerRef.current)
    }, [markerRef.current])

    // const addMarker = () => {
    //     console.log("add marker")
    // }

    return (
        <>
            <MapContainer center={[59.85599174491208, 17.640352062197294]} zoom={13} maxZoom={16} minZoom={5} maxBounds={bounds} style={{ height: "90vh", width: "100%" }} zoomControl={false}>
                <ZoomControl position="bottomright" />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    eventHandlers={eventHandlers}
                    position={[59.85599174491208, 17.640352062197294]}
                    icon={iconPinRed}
                    draggable={true}
                    animate={true}
                    ref={markerRef}
                >
                    <Popup>
                        Hey ! you found me
                    </Popup>
                </Marker>
            </MapContainer>
        </>
    )
}