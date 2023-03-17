import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as pinIcons from '../components/icons'
import React from 'react'
import Image from 'next/image'
import { PopupHead, PopupText, flexRow, AlignLinks, PopupLinkPdf, PopupLinkReport } from "../components/popupStyles";
import { DeepStory, StoryFilter } from '@/types'
import { runActiveFilters } from '@/functions/filters/storyFilters'
import { Story } from '@prisma/client';

export function storiesPopup(pin: any) {
  return (
    <Popup className='request-popup'>
      <div>
        <div style={PopupHead}>
          {pin.mapItem.name}
        </div>
        <div style={PopupText}>
          {!pin.mapItem.year ? null : <span>{pin.mapItem.year}<br /></span>}
          {!pin.mapItem.address ? null : <span>{pin.mapItem.address}<br /></span>}
          {!pin.mapItem.organisation ? null : <span>{pin.mapItem.organisation}<br /></span>}
          {!pin.descriptionSwedish ? null : <p>{pin.descriptionSwedish}</p>}
          {!pin.videos ? null : <iframe width="100%" height="auto" src={pin.videos} />}
          <div style={flexRow}>
            {!pin.pdfCase ? null : <div style={AlignLinks}><a href={pin.pdfCase}><span style={PopupLinkPdf}><Image width={30} height={30} src="/images/categories/case.svg" alt="Case"/></span></a>Case</div>}
            {!pin.reports ? null : <div style={AlignLinks}><a href={pin.reports}><span style={PopupLinkReport}><Image width={0} height={30} src="/images/categories/newspaper.svg" alt="Rapport"/></span></a>Rapport</div>}
          </div>
        </div>
      </div>
    </Popup>
  )
}

const iconArray = [pinIcons.IconPinPink, pinIcons.IconPinPaleGreen, pinIcons.IconPinDarkGreen, pinIcons.IconPinYellow, pinIcons.IconPinPurple, pinIcons.IconPinBlue, pinIcons.IconPinPalePurple, pinIcons.IconPinPalePink, pinIcons.IconPinTeal, pinIcons.IconPinOrange, pinIcons.IconPinHotPink, pinIcons.IconPinGray, pinIcons.IconPinLime, pinIcons.IconPinDarkPurple, pinIcons.IconPinNavy, pinIcons.IconPinGreen, pinIcons.IconPinGold, pinIcons.IconPinCrimson, pinIcons.IconPinPaleGray, pinIcons.IconPinPaleBlue, pinIcons.IconPinLightBlue];
const categoryArray = ["solel", "energilagring", "hållbarhet", "energi", "mätning", "vatten", "social hållbarhet", "hälsa", "bioteknik", "öppna data", "elbil", "transport", "byggnader", "skolkök", "renovering", "klimat", "effekt", "värme", "cleantech", "vindkraft", "kyla"]

function getIcon(pinIndex: number, mapData: DeepStory[], currentFilter: StoryFilter) {
  // TODO Make it so pins are colored based on the first category in the filter that macthes the pin
  for (let i in categoryArray) {
    if (currentFilter.categories && currentFilter.categories[0]?.toLowerCase().includes(categoryArray[i])) {
      return iconArray[i]
    }
  }
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
        <Marker key={pin.id} position={[pin.mapItem.latitude!, pin.mapItem.longitude!]} icon={getIcon(pinIndex, filteredData, currentFilter)}>
          {pin ? storiesPopup(pin) : null}
        </Marker>
      )
    }
  })
}