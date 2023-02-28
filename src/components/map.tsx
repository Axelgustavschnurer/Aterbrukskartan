import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed, IconPinGreen, IconPinBlue } from './icons'
import React, { useState, useEffect } from 'react'
import { PopupContent, PopupHead, PopupText, OkText } from "./popupStyles";
import { Recycle } from '@prisma/client'

export default function Map(currentFilter: any) {
    const [mapData, setMapData] = useState([])

    const fetchData = async () => {
        const response = await fetch('http://localhost:3000/api/getData')
        const data = await response.json()
        setMapData(data)

    }

    useEffect(() => {
        fetchData()
    }, [])

    const popup = (pin: any) => {
        return (
            <Popup className='request-popup'>
                <div style={PopupContent}>
                    <div style={PopupHead}>
                        Det här är ett {pin.projectType}s projekt. <br />
                    </div>
                    <span style={PopupText}>
                        {!pin.mapItem.year ? "Projektet har inget planerat startdatum" : pin.mapItem.year} <br />
                    </span>
                    <span style={PopupText}>
                        {pin.description} <br />
                    </span>
                    <span style={PopupText}>
                        {pin.contact}
                    </span>
                    <div style={PopupText}>
                        <a href={pin.externalLink}>{pin.externalLink}</a>
                    </div>
                </div>
            </Popup>
        )
    }

    const getAllPins = () => {
        return mapData.map((pin: Recycle, i) => {
            console.log("pin", pin)
            if (currentFilter.currentFilter === "none") {
                return (
                    <Marker key={i} position={[pin.mapItem.latitude, pin.mapItem.longitude]} icon={
                        pin.projectType === "Rivning" ? IconPinRed :
                            pin.projectType === "Nybyggnation" ? IconPinBlue :
                                IconPinGreen
                    }>

                        {popup(pin)}
                    </Marker>
                )
            } else if (pin.projectType === currentFilter.currentFilter) {
                return (
                    <Marker key={i} position={[pin.mapItem.latitude, pin.mapItem.longitude]} icon={
                        pin.projectType === "Rivning" ? IconPinRed :
                            pin.projectType === "Nybyggnation" ? IconPinBlue :
                                IconPinGreen
                    }>

                        {popup(pin)}

                    </Marker>
                )

            }
        }
        )
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