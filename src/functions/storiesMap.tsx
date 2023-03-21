import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as pinIcons from '../components/icons'
import React from 'react'
import Image from 'next/image'
import { PopupHead, PopupText, flexRow, AlignLinks, PopupLinkPdf, PopupLinkReport, Divider, DividerLineDesc, DividerLineVideo, DividerLineCase, DividerLineReport, PopupDesc } from "../components/popupStyles";
import { DeepStory, StoryFilter } from '@/types'
import { runActiveFilters } from '@/functions/filters/storyFilters'
import { Story } from '@prisma/client';
import { Collapse } from '@nextui-org/react'

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

          {/*Divider for description */}
          {!pin.descriptionSwedish ? null :
            <div style={Divider}>
              <div style={DividerLineDesc}></div>
              <Image width={25} height={25} src="/images/dividers/description.svg" alt="Delare" />
              <div style={DividerLineDesc}></div>
            </div>}
          {!pin.descriptionSwedish ? null : <Collapse title="Beskrivning" subtitle="Tryck för att visa / gömma beskrivning" divider={false}><div style={PopupDesc}><p>{pin.descriptionSwedish}</p></div></Collapse>}
          {
            !pin.videos ? null :
              <div style={Divider}>
                <div style={DividerLineVideo}></div>
                <Image width={25} height={25} src="/images/dividers/video.svg" alt="Delare" />
                <div style={DividerLineVideo}></div>
              </div>
          }
          {!pin.videos ? null : <iframe style={{ borderRadius: "10px" }} width="100%" height="auto" src={pin.videos} allowFullScreen />}

          {/*Divider for pdfCase */}
          {
            !pin.pdfCase && pin.reports || !pin.pdfCase && !pin.reports || pin.pdfCase && pin.reports ? null :
              <div style={Divider}>
                <div style={DividerLineCase}></div>
                <Image width={25} height={25} src="/images/dividers/case.svg" alt="Delare" />
                <div style={DividerLineCase}></div>
              </div>
          }
          {/*Divider for reports */}
          {
            !pin.reports && pin.pdfCase || !pin.pdfCase && !pin.reports ? null :
              <div style={Divider}>
                <div style={DividerLineReport}></div>
                <Image width={25} height={25} src="/images/dividers/report.svg" alt="Delare" />
                <div style={DividerLineReport}></div>
              </div>
          }
          <div style={flexRow}>
            {!pin.pdfCase ? null :
              <div style={AlignLinks}>
                <a href={pin.pdfCase} target="_blank" rel="noreferrer">
                  <span style={PopupLinkPdf}>
                    <Image width={30} height={30} src="/images/categories/case.svg" alt="Case" />
                  </span>
                </a>
                Case
              </div>}
            {!pin.reports ? null :
              <div style={AlignLinks}>
                <a href={pin.reports} target="_blank" rel="noreferrer">
                  <span style={PopupLinkReport}>
                    <Image width={30} height={30} src="/images/categories/newspaper.svg" alt="Rapport" />
                  </span>
                </a>
                Rapport
              </div>}
          </div>
        </div>
      </div>
    </Popup>
  )
}

const iconArray = [pinIcons.IconPinPink, pinIcons.IconPinPaleGreen, pinIcons.IconPinDarkGreen, pinIcons.IconPinYellow, pinIcons.IconPinPurple, pinIcons.IconPinBlue, pinIcons.IconPinPalePurple, pinIcons.IconPinPalePink, pinIcons.IconPinTeal, pinIcons.IconPinOrange, pinIcons.IconPinHotPink, pinIcons.IconPinGray, pinIcons.IconPinLime, pinIcons.IconPinDarkPurple, pinIcons.IconPinNavy, pinIcons.IconPinGreen, pinIcons.IconPinGold, pinIcons.IconPinCrimson, pinIcons.IconPinPaleGray, pinIcons.IconPinPaleBlue, pinIcons.IconPinLightBlue];
const categoryArray = ["solel", "energilagring", "hållbarhet", "energi", "mätning", "vatten", "social hållbarhet", "hälsa", "bioteknik", "öppna data", "elbil", "transport", "byggnader", "skolkök", "renovering", "klimat", "effekt", "värme", "cleantech", "vindkraft", "kyla"]

function getIcon(pinIndex: number, mapData: DeepStory[], currentFilter: StoryFilter) {
  // TODO Make it so pins are colored based on the first category in the filter *that matches with the pin*
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