import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as pinIcons from '../components/icons'
import React from 'react'
import { PopupHead, PopupText } from "../components/popupStyles";
import { DeepStory, StoryFilter } from '@/types'
import { runActiveFilters } from '@/functions/filters/storyFilters'
import { Story } from '@prisma/client';

export function storiesPopup(pin: any) {
  return (
    <Popup className='request-popup'>
      <div>
        <div style={PopupHead}>
          {pin.mapItem.organisation}
        </div>
        <div style={PopupText}>
          {!pin.mapItem.year ? "Inget startår angivet" : "Projektet startardes " + pin.mapItem.year}
          {pin.projectType}
          {!pin.contact ? <p><b>Kontakt</b> <br /> Ingen kontaktinformation tillgänglig</p> : <p><b>Kontakt</b> <br /> {pin.contact}</p>}
        </div>
      </div>
    </Popup>
  )
}

const iconArray = [pinIcons.IconPinPink, pinIcons.IconPinPaleGreen, pinIcons.IconPinDarkGreen, pinIcons.IconPinYellow, pinIcons.IconPinPurple, pinIcons.IconPinBlue, pinIcons.IconPinPalePurple, pinIcons.IconPinPalePink, pinIcons.IconPinTeal, pinIcons.IconPinOrange, pinIcons.IconPinHotPink, pinIcons.IconPinGray, pinIcons.IconPinLime, pinIcons.IconPinDarkPurple, pinIcons.IconPinNavy, pinIcons.IconPinGreen, pinIcons.IconPinGold, pinIcons.IconPinCrimson, pinIcons.IconPinPaleGray, pinIcons.IconPinPaleBlue, pinIcons.IconPinLightBlue];
const categoryArray = ["solel", "energilagring", "hållbarhet", "energi", "mätning", "vatten", "social hållbarhet", "hälsa", "bioteknik", "öppna data", "elbil", "transport", "byggnader", "skolkök", "renovering", "klimat", "effekt", "värme", "cleantech", "vindkraft", "kyla"]

function getIcon(pinIndex: number, mapData: DeepStory[]) {
  for (let i in categoryArray) {
    if (mapData[pinIndex].categorySwedish?.toLowerCase().includes(categoryArray[i])) {
      return iconArray[i]
    }
  }
  return iconArray[20]
}
let test: Story;
export function storiesPins(mapData: DeepStory[], currentFilter: StoryFilter, searchInput: string | undefined) {
  if (searchInput) {
    currentFilter = { ...currentFilter, searchInput: searchInput }
  }
  let filteredData = runActiveFilters(mapData, currentFilter)

  return filteredData.map((pin: DeepStory, pinIndex: number) => {
    if (!pin.mapItem.latitude || !pin.mapItem.longitude) {
      return null
    } else {
      return (
        <Marker key={pin.id} position={[pin.mapItem.latitude!, pin.mapItem.longitude!]} icon={getIcon(pinIndex, filteredData)}>
          {pin ? storiesPopup(pin) : null}
        </Marker>
      )
    }
  })
}