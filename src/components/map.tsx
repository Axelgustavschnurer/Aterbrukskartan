import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed, IconPinGreen, IconPinBlue } from './icons'
import React, { useState, useEffect } from 'react'
import { PopupHead, PopupText } from "./popupStyles";
import { Recycle } from '@prisma/client'
import { DeepRecycle } from '@/types'

// Map component for main page

export default function Map(currentFilter: any) {
    // Declares array for map items and function to set the array
    const [mapData, setMapData] = useState([])

    // Fetches all "recycle" data from API
    const fetchData = async () => {
        const response = await fetch('http://localhost:3000/api/getData')
        const data = await response.json()
        setMapData(data)
    }

    // Runs fetchData function on component mount
    useEffect(() => {
        fetchData()
    }, [])

    // Declrares content of popups that will be displayed when clicking on a pin
    const popup = (pin: any) => {
        return (
            <Popup className='request-popup'>
                <div>
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
                        <a href={pin.externalLinks}>{pin.externalLinks}</a>
                    </div>
                </div>
            </Popup>
        )
    }

    // Declares function that returns all pins with the correct icon, depending on project type. Also checks if a filter is applied and only returns pins that match the filter.
    const getAllPins = () => {
        return mapData.map((pin: DeepRecycle, i) => {
            console.log("pin", pin)
            if (currentFilter.currentFilter === "none") {
                return (
                    <Marker key={i} position={[pin.mapItem.latitude!, pin.mapItem.longitude!]} icon={
                        pin.projectType === "Rivning" ? IconPinRed :
                            pin.projectType === "Nybyggnation" ? IconPinBlue :
                                IconPinGreen
                    }>

                        {popup(pin)}
                    </Marker>
                )
            } else if (pin.projectType === currentFilter.currentFilter) {
                return (
                    <Marker key={i} position={[pin.mapItem.latitude!, pin.mapItem.longitude!]} icon={
                        pin.projectType === "Rivning" ? IconPinRed :
                            pin.projectType === "Nybyggnation" ? IconPinBlue :
                                IconPinGreen
                    }>
                        {popup(pin)}
                    </Marker>
                )
            }
        })
    }

    // Declares map bounds
    var southWest = L.latLng(50, -20),
        northEast = L.latLng(72, 60),
        bounds = L.latLngBounds(southWest, northEast);

    // Returns map with all relevant pins
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