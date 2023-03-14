import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IconPinRed, IconPinGreen, IconPinBlue } from './icons'
import React, { useState, useEffect } from 'react'
import { PopupHead, PopupText } from "./popupStyles";
import { DeepRecycle, Filter } from '@/types'
import { runActiveFilters } from '@/functions/filterData'
import MarkerClusterGroup from './markerCluster/index.js'
import { monthArray } from '@/pages/aterbruk'


// Map component for recyle page

export default function RecycleMap({ popup, setPopup, setAllPins, currentFilter, searchInput, mapData }: any) {
    setPopup((pin: any) => {
        return (
          <Popup className='request-popup'>
            <div>
              <div style={PopupHead}>
                {pin.mapItem.organisation}
              </div>
              <div style={PopupText}>
                <b>{pin.projectType}</b> <br />
                {!pin.mapItem.year ? "Projektet har inget planerat startdatum" :pin.mapItem.year && !pin.month ? "Projektet påbörjas år: " + pin.mapItem.year : "Projektet påbörjas: " + monthArray[pin.month - 1] + " " + pin.mapItem.year} <br />
                <>
                  {pin.projectType === "Rivning" && pin.availableMaterials ? <p><b>Erbjuds</b> <br /> {pin.availableMaterials}</p>
                    : pin.projectType === "Rivning" && !pin.availableMaterials ? <p><b>Erbjuds</b> <br /> Inget material angivets</p>
                      : pin.projectType === "Nybyggnation" && pin.lookingForMaterials ? <p><b>Sökes</b> <br /> {pin.lookingForMaterials}</p>
                        : pin.projectType === "Nybyggnation" && !pin.lookingForMaterials ? <p><b>Sökes</b> <br /> Inget material angivets</p>
                          : pin.projectType === "Ombyggnation" && pin.availableMaterials && pin.lookingForMaterials ? <><p><b>Erbjuds</b> <br /> {pin.availableMaterials}</p> <p><b>Sökes</b> <br /> {pin.lookingForMaterials}</p></>
                            : pin.projectType === "Ombyggnation" && !pin.availableMaterials && !pin.lookingForMaterials ? <><p><b>Erbjuds</b> <br /> Inget material angivets</p> <p><b>Sökes</b> <br /> Inget material angivets</p></>
                              : pin.projectType === "Ombyggnation" && pin.availableMaterials && !pin.lookingForMaterials ? <p><b>Erbjuds</b> <br /> {pin.availableMaterials}</p>
                                : pin.projectType === "Ombyggnation" && !pin.availableMaterials && pin.lookingForMaterials ? <p><b>Sökes</b> <br /> {pin.lookingForMaterials}</p>
                                  : null
                  }
                </>
                {!pin.description ? null : <p><b>Beskrvining</b> <br /> {pin.description}</p>}
                {!pin.contact ? <p><b>Kontakt</b> <br /> Ingen kontaktinformation tillgänglig</p> : <p><b>Kontakt</b> <br /> {pin.contact}</p>}
                {!pin.externalLinks ? null : <div><b>Länkar</b> <br /> <a href={pin.externalLinks}>{pin.externalLinks}</a></div>}
              </div>
            </div>
          </Popup>
        )
      })
    
    setAllPins(() => {
      if (searchInput) {
        currentFilter = { ...currentFilter, searchInput: searchInput }
      }
      let filteredData = runActiveFilters(mapData, currentFilter)
      return filteredData.map((pin: DeepRecycle, i) => {
        if (!pin.mapItem.latitude || !pin.mapItem.longitude) {
          return null
        } else {
          return (
            <Marker key={pin.id} position={[pin.mapItem.latitude!, pin.mapItem.longitude!]} icon={
              pin.projectType === "Rivning" ? IconPinRed :
                pin.projectType === "Nybyggnation" ? IconPinBlue :
                  IconPinGreen
            }>
  
              {popup(pin)}
            </Marker>
          )
        }
      })
    })
}