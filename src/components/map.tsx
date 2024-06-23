import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import MarkerClusterGroup from './markerCluster/index.js'
import { recyclePins } from '@/functions/recycleMap'

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

  const [isLoading, setIsLoading] = useState(false)

  // Runs fetchData function on component mount
  useEffect(() => {
    // Fetches all relevant data from API
    const fetchData = async () => {
      const response = await fetch('/api/recycle')
      const data = await response.json()
      setMapData(data)
    }
    setIsLoading(true)
    fetchData().then(() => setIsLoading(false))
  }, [currentMap])

  // Declares map bounds
  var southWest = L.latLng(50, -20),
    northEast = L.latLng(72, 60),
    bounds = L.latLngBounds(southWest, northEast);

  return (
    <>
      { // Simple loading animation with inline styling
        // TODO: Remove inline styling
        isLoading &&
        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', position: 'absolute', top: '0', left: '0', backgroundColor: 'rgba(255, 255, 255, .75)', borderRadius: '.5rem', zIndex: 99 }}>
          <Image src="/loading.svg" alt="Laddar data" width={128} height={128}></Image>
        </div>
      }
      <MapContainer center={[59.858227, 17.632252]} zoom={13} maxZoom={16} minZoom={5} maxBounds={bounds} style={{ height: "100%", width: "100%", borderRadius: '.5rem' }} zoomControl={false}>
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          showCoverageOnHover={false}
          maxClusterRadius={((zoom: number) => {
            if (zoom > 6) { return 40 }
            else { return 80 }
          })}>
          {recyclePins(mapData, currentFilter, searchInput)}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  )
}