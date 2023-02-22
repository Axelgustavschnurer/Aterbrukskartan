import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { iconPinRed, iconPinGreen, iconPinBlue } from './icons'
import React, { useState, useEffect } from 'react'
import { popupContent, popupHead, popupText, okText } from "./popupStyles";

export default function Map(currentFilter: any) {
    useEffect(() => {
        fetch('http://localhost:3000/api/getData')
            .then(res => res.json())
            .then(data => console.log(data))
    }, [])

    const pins = [ // This is an array of objects with the coordinates of the pins
        { lat: 59.858227, lng: 17.632252, type: "rivning", year: 2021, description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },
        { lat: 59.857227, lng: 17.622252, type: "byggnad", year: 2022, description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },
        { lat: 59.858227, lng: 17.602252, type: "ombyggnad", year: 2022, description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },
        { lat: 59.884227, lng: 17.624252, type: "rivning", year: 2021, description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },
        { lat: 59.898227, lng: 17.608252, type: "byggnad", year: 2018, description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },
        { lat: 59.869999, lng: 17.609952, type: "ombyggnad", year: 2023, description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },
        { lat: 59.828227, lng: 17.62252, type: "rivning", year: "ongoing", description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },
        { lat: 59.858227, lng: 17.612252, type: "byggnad", year: 2021, description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },
        { lat: 59.866227, lng: 17.673252, type: "ombyggnad", year: 2022, description: "Detta är en beskrivning", contact: "Namn, telefonnummer", link: "https://ccbuild.se/" },

    ]

    const popup = (pin: any) => {
        return (
            <Popup className='request-popup'>
                <div style={popupContent}>
                    <div style={popupHead}>
                        Det här är ett {pin.type}s projekt. <br />
                    </div>
                    <span style={popupText}>
                        {pin.year === "ongoing" ? "Projektet pågår fortfarande." : pin.year} <br />
                    </span>
                    <span style={popupText}>
                        {pin.description} <br />
                    </span>
                    <span style={popupText}>
                        {pin.contact}
                    </span>
                    <div style={popupText}>
                        <a href={pin.link}>{pin.link}</a>
                    </div>
                </div>
            </Popup>
        )
    }

    const getAllPins = () => {
        return pins.map((pin, i) => {
            if (currentFilter.currentFilter === "none") {
                return (
                    <Marker key={i} position={[pin.lat, pin.lng]} icon={
                        pin.type === "rivning" ? iconPinRed :
                            pin.type === "byggnad" ? iconPinBlue :
                                iconPinGreen
                    }>

                        {popup(pin)}
                    </Marker>
                )
            } else if (pin.type === currentFilter.currentFilter) {
                return (
                    <Marker key={i} position={[pin.lat, pin.lng]} icon={
                        pin.type === "rivning" ? iconPinRed :
                            pin.type === "byggnad" ? iconPinBlue :
                                iconPinGreen
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