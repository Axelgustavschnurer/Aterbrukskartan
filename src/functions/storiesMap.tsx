import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { IconPinRed, IconPinGreen, IconPinBlue } from '../components/icons'
import React from 'react'
import { PopupHead, PopupText } from "../components/popupStyles";
import { DeepStory, Filter } from '@/types'
import { runActiveFilters } from '@/functions/filterData'

export function storiesPopup(pin: any) {
  return (
    <Popup className='request-popup'>
      <div>
        <div style={PopupHead}>
          {pin.mapItem.organisation}
        </div>
        <div style={PopupText}>
          <b>{pin.projectType}</b> <br />
          {!pin.mapItem.year ? "Inget startår angivets" : "Projektet startardes " + pin.mapItem.year}
          <>
            {pin.projectType}
          </>
          {!pin.description ? null : <p><b>Beskrvining</b> <br /> {pin.description}</p>}
          {!pin.contact ? <p><b>Kontakt</b> <br /> Ingen kontaktinformation tillgänglig</p> : <p><b>Kontakt</b> <br /> {pin.contact}</p>}
          {!pin.externalLinks ? null : <div><b>Länkar</b> <br /> <a href={pin.externalLinks}>{pin.externalLinks}</a></div>}
        </div>
      </div>
    </Popup>
  )
}

export function storiesPins(mapData: DeepStory[], currentFilter: Filter, searchInput: string | undefined) {
  if (searchInput) {
    currentFilter = { ...currentFilter, searchInput: searchInput }
  }
//   let filteredData = runActiveFilters(mapData, currentFilter)

  return mapData.map((pin: DeepStory, i) => {
    if (!pin.mapItem.latitude || !pin.mapItem.longitude) {
      return null
    } else {
      return (
        <Marker key={pin.id} position={[pin.mapItem.latitude!, pin.mapItem.longitude!]} icon={IconPinBlue}>

          {pin ? storiesPopup(pin) : null}
        </Marker>
      )
    }
  })
}