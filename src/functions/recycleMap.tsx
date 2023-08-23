import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { IconPinRed, IconPinGreen, IconPinAzure, IconPinWhite, IconPinOrange } from '../components/icons'
import React from 'react'
import { PopupHead, PopupText } from "../components/popupStyles";
import { DeepRecycle, RecycleFilter } from '@/types'
import { runActiveFilters } from '@/functions/filters/recycleFilters'
import { monthArray } from '@/pages/aterbruk'


/**
 * Creates a popup for the passed pin
 * @param pin DeepStory object containing all the information about the pin
 * @returns JSX.Element 
 */
export function recyclePopup(pin: DeepRecycle) {
  return (
    <Popup className='request-popup'>
      <div>
        <div style={PopupHead}>
          {pin.mapItem.organisation}
        </div>
        <div style={PopupText}>
          <b>{pin.projectType}</b> <br />
          {!pin.mapItem.year ? "Projektet har inget planerat startdatum" : pin.mapItem.year && !pin.month ? "Projektet påbörjas år: " + pin.mapItem.year : "Projektet påbörjas: " + monthArray[pin.month! - 1] + " " + pin.mapItem.year} <br />
          <>
            {/* This abomination checks multiple factors of materials being offered or requested and then displays the results */}
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
}

/**
 * Creates markers for all pins that pass the active filters
 * @param mapData Array of DeepRecycle objects, containing all the data for the pins
 * @param currentFilter Currently active filters
 * @param searchInput The current text in the search bar
 * @returns JSX.Element
 */
export function recyclePins(mapData: DeepRecycle[], currentFilter: RecycleFilter, searchInput: string | undefined) {
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
            pin.projectType === "Nybyggnation" ? IconPinAzure :
              pin.projectType === "Ombyggnation" ? IconPinGreen :
                pin.projectType === "Mellanlagring" ? IconPinOrange :
                  IconPinWhite
        }>

          {pin ? recyclePopup(pin) : null}
        </Marker>
      )
    }
  })
}