import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed, IconPinGreen, IconPinBlue } from './icons'
import React, { useState, useEffect } from 'react'
import { PopupHead, PopupText } from "./popupStyles";
import { DeepRecycle, Filter } from '@/types'
import { runActiveFilters } from '@/functions/filterData'

// Map component for main page

export default function Map({ currentFilter, searchInput }: any) {
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
            {pin.mapItem.organisation}
          </div>
          <div style={PopupText}>
            <h4>{pin.projectType}</h4>
            {!pin.mapItem.year ? "Projektet har inget planerat startdatum" : "Projektet påbörjas år: " + pin.mapItem.year}
            <p>
              {pin.projectType === "Rivning" && pin.availableMaterials ? <p><h4>Erbjuds</h4> {pin.availableMaterials}</p>
                : pin.projectType === "Rivning" && !pin.availableMaterials ? <p><h4>Erbjuds</h4> Material saknas</p>
                  : pin.projectType === "Nybyggnation" && pin.lookingForMaterials ? <p><h4>Sökes</h4> {pin.lookingForMaterials}</p>
                    : pin.projectType === "Nybyggnation" && !pin.lookingForMaterials ? <p><h4>Sökes</h4> Material saknas</p>
                      : pin.projectType === "Ombyggnation" && pin.availableMaterials && pin.lookingForMaterials ? <p><h4>Sökes</h4> {pin.lookingForMaterials}<p><h4>Erbjuds</h4> {pin.availableMaterials}</p></p>
                        : pin.projectType === "Ombyggnation" && !pin.availableMaterials && !pin.lookingForMaterials ? <p><h4>Sökes</h4> Material saknas <br /><h4>Erbjuds</h4> Material saknas</p>
                          : pin.projectType === "Ombyggnation" && pin.availableMaterials && !pin.lookingForMaterials ? <p><h4>Erbjuds</h4> {pin.availableMaterials}</p>
                            : pin.projectType === "Ombyggnation" && !pin.availableMaterials && pin.lookingForMaterials ? <p><h4>Sökes</h4> {pin.lookingForMaterials}</p>
                              : null
              }
            </p>
            {!pin.description ? null : <p><h4>Beskrvining</h4> {pin.description}</p>}
            {!pin.contact ? <p><h4>Kontakt</h4>Ingen kontaktinformation tillgänglig</p> : <p><h4>Kontakt</h4> {pin.contact}</p>}
            {!pin.externalLinks ? null : <div><h4>Länkar</h4><a href={pin.externalLinks}>{pin.externalLinks}</a></div>}
          </div>
        </div>
      </Popup>
    )
  }

  // Declares function that returns all pins with the correct icon, depending on project type. Also checks if a filter is applied and only returns pins that match the filter.
  const getAllPins = () => {
    if (searchInput) {
      currentFilter = { ...currentFilter, searchInput: searchInput}
    }
    let filteredData = runActiveFilters(mapData, currentFilter)
    return filteredData.map((pin: DeepRecycle, i) => {
      if (!pin.mapItem.latitude || !pin.mapItem.longitude) {
        return null
      } else {
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