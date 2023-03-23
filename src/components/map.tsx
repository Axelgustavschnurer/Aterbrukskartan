import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import React, { useState, useEffect, useMemo } from 'react'
import MarkerClusterGroup from './markerCluster/index.js'
import { recyclePins } from '@/functions/recycleMap'
import { storiesPins } from '@/functions/storiesMap'


/**
 * Function to render the map with all relevant pins
 * @param currentFilter The current filter
 * @param searchInput The current search input within the search bar
 * @param currentMap The current map. Either "Stories" or "Recycle"
 * @returns The map with all relevant pins
 */
export default function Map({ currentFilter, searchInput, currentMap }: any) {
  // Declares array for map items and function to set the array
  const [mapData, setMapData] = useState([])

  // Fetches all relevant data from API
  const fetchData = async () => {
    if (currentMap === "Stories") {
      const response = await fetch('http://localhost:3000/api/stories')
      const data = await response.json()
      setMapData(data)
    } 
    else if (currentMap === "Recycle") {
      const response = await fetch('http://localhost:3000/api/recycle')
      const data = await response.json()
      setMapData(data)
    }
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Declares map bounds
  var southWest = L.latLng(50, -20),
    northEast = L.latLng(72, 60),
    bounds = L.latLngBounds(southWest, northEast);

  return (
    <>
      <MapContainer center={[59.858227, 17.632252]} zoom={13} maxZoom={16} minZoom={5} maxBounds={bounds} style={{ height: "100vh", width: "100%" }} zoomControl={false}>
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {currentMap === "Stories" ? 
        <MarkerClusterGroup 
          showCoverageOnHover={false} 
          maxClusterRadius={((zoom: number) => 
            {if (zoom > 6 && zoom < 13) {return 40}
             else if (zoom >= 13) {return 30}
             else { return 80 }})}> 
            {storiesPins(mapData, currentFilter, searchInput)} 
        </MarkerClusterGroup> 
        : currentMap === "Recycle" ? 
        <MarkerClusterGroup 
          disableClusteringAtZoom={13} 
          showCoverageOnHover={false} 
          spiderfyOnMaxZoom={false} 
          maxClusterRadius={((zoom: number) => 
          {if (zoom > 6 && zoom < 13) {return 40} 
           else { return 80 }})}>
          {recyclePins(mapData, currentFilter, searchInput)}
        </MarkerClusterGroup>
        : null}
      </MapContainer>
    </>
  )
}