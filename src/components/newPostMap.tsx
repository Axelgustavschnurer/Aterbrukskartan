import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed } from './icons'
import React, { useRef } from 'react'

function MovableMarker({ setLat, setLon, lat, lon, defaultLat = 59.85599174491208, defaultLon = 17.640352062197294 }: any) {
  const markerRef = useRef<any>(null);

  // Event listener for when the user clicks on the map
  useMapEvents({
    click(e) {
      console.log(e.latlng);
      setLat(e.latlng.lat.toFixed(6));
      setLon(e.latlng.lng.toFixed(6));
      markerRef.current?.openPopup();
    }
  });

  return (
    <Marker
      position={!lat && !lon ? [defaultLat, defaultLon] : [lat, lon]}
      icon={IconPinRed}
      draggable={true}
      ref={markerRef}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setLat(position.lat.toFixed(6));
          setLon(position.lng.toFixed(6));
          e.target.openPopup();
        }
      }}
    >
      <Popup>
        <span>{lat || lon ? `Platsen [${lat}, ${lon}] har sparats` : "Klicka på en plats på kartan eller dra i den här markören för att välja en plats"}</span>
      </Popup>
    </Marker>
  )
}

// Map component for "New Post" page
export default function NewPostMap({ setLat, setLon, lat, lon, defaultLat = 59.85599174491208, defaultLon = 17.640352062197294 }: any) {
  // Declares bounds of the map
  var southWest = L.latLng(50, -20),
    northEast = L.latLng(72, 60),
    bounds = L.latLngBounds(southWest, northEast);

  // Returns map with red marker pin
  return (
    <>
      <MapContainer center={!lat && !lon ? [defaultLat, defaultLon] : [lat, lon]} zoom={13} maxZoom={16} minZoom={5} maxBounds={bounds} style={{ height: "90vh", width: "100%", borderRadius: '.5em', margin: "2em 0" }} zoomControl={false} >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MovableMarker
          setLat={setLat}
          setLon={setLon}
          lat={lat}
          lon={lon}
          defaultLat={defaultLat}
          defaultLon={defaultLon}
        />
      </MapContainer>
    </>
  )
}