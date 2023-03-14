import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed, IconPinGreen, IconPinBlue } from './icons'
import React, { useState, useEffect } from 'react'
import { PopupHead, PopupText } from "./popupStyles";
import { DeepRecycle, Filter } from '@/types'
import { runActiveFilters } from '@/functions/filterData'
import { monthArray } from '@/pages/aterbruk'
import MarkerClusterGroup from './markerCluster/index.js'
import recycleMap from './recycleMap'

// Map component for main page

export default function Map({ currentFilter, searchInput, currentMap }: any) {
  // Declares array for map items and function to set the array
  const [mapData, setMapData] = useState([])

  // Fetches all "recycle" data from API
  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/recycle')
    const data = await response.json()
    setMapData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Declrares content of popups that will be displayed when clicking on a pin
  const [popup, setPopup] = useState(() => null)

  // Declares function that returns all pins with the correct icon, depending on project type. Also checks if a filter is applied and only returns pins that match the filter.
  const [allPins, setAllPins] = useState(() => null)

  // Declares map bounds
  var southWest = L.latLng(50, -20),
    northEast = L.latLng(72, 60),
    bounds = L.latLngBounds(southWest, northEast);

  // Add if statement to call recycleMap or storiesMap depending on currentMap
  recycleMap({popup, setPopup, setAllPins, currentFilter, searchInput, mapData})

  // Returns map with all relevant pins
  return (
    <>
      <MapContainer center={[59.858227, 17.632252]} zoom={13} maxZoom={15} minZoom={5} maxBounds={bounds} style={{ height: "100vh", width: "100%" }} zoomControl={false}>
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          disableClusteringAtZoom={13}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={false}
          maxClusterRadius={((zoom: number) => {
            if (zoom > 6 && zoom < 13) {
              return 40
            } else { return 80 }
          })}>
          {allPins}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  )
}