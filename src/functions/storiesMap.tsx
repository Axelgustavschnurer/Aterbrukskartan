import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as pinIcons from '../components/icons'
import React from 'react'
import Image from 'next/image'
import * as popup from "../components/popupStyles";
import { DeepStory, StoryFilter } from '@/types'
import { runActiveFilters } from '@/functions/filters/storyFilters'
import { Collapse } from '@nextui-org/react'
import { log } from 'console'

/**
 * Creates a popup for the passed pin
 * @param pin DeepStory object containing all the information about the pin
 * @returns JSX.Element 
 */
export function storiesPopup(pin: DeepStory | any) {
  return (
    <Popup className='request-popup'>
      <div>

        {/* Name of the project to be displayed as header */}
        <div style={popup.PopupHead}>
          {pin.mapItem.name}
        </div>

        {/* Popup contents */}
        <div style={popup.PopupText}>
          {/* If the pin has extra info, display it */}
          {!pin.mapItem.year ? null : <span>{pin.mapItem.year}<br /></span>}
          {!pin.mapItem.address ? null : <span>{pin.mapItem.address}<br /></span>}
          {!pin.mapItem.organisation ? null : <span>{pin.mapItem.organisation}<br /></span>}

          {/* If the pin has a descpirtion, make a divider and a collapse menu to display it in */}
          {!pin.descriptionSwedish ? null :
            <div style={popup.Divider}>
              <div style={popup.DividerLineDesc}></div>
              <Image width={25} height={25} src="/images/dividers/description.svg" alt="Delare" />
              <div style={popup.DividerLineDesc}></div>
            </div>}
          {!pin.descriptionSwedish ? null : <Collapse title="Sammanfattning" subtitle="Tryck för att visa / gömma sammanfattning" divider={false}><div style={popup.PopupDesc}><p>{pin.descriptionSwedish}</p></div></Collapse>}

          {/* If the pin has a video link, make a divider and an iframe to display it in */}
          {!pin.videos ? null :
            <div style={popup.Divider}>
              <div style={popup.DividerLineVideo}></div>
              <Image width={25} height={25} src="/images/dividers/video.svg" alt="Delare" />
              <div style={popup.DividerLineVideo}></div>
            </div>
          }
          {!pin.videos ? null : <iframe style={{ borderRadius: "10px" }} width="100%" height="auto" src={pin.videos} allowFullScreen />}

          {/* If there is a report link, make a purple divider */}
          {!pin.reports ? null :
            <div style={popup.Divider}>
              <div style={popup.DividerLineReport}></div>
              <Image width={25} height={25} src="/images/dividers/infopurple.svg" alt="Delare" />
              <div style={popup.DividerLineReport}></div>
            </div>
          }
          {/* If there is a report link, PDF case link or open data link, make a button of corresponding color with said link */}
          <div style={popup.flexRow}>
            {!pin.reports ? null :
              <div style={popup.AlignLinks}>
                <a href={!!pin.reportLink ? pin.reportLink : pin.reportSite} target="_blank" rel="noreferrer">
                  <span style={popup.PopupLinkReport}>
                    <Image width={30} height={30} src="/images/categories/newspaper.svg" alt="Rapport" />
                  </span>
                </a>
                Rapport
              </div>}

            {/* If there is a PDF case link but no report link, make a green divider */}
            {!pin.pdfCase ? null :
              <div style={popup.Divider}>
                <div style={popup.DividerLineCase}></div>
                <Image width={25} height={25} src="/images/dividers/infogreen.svg" alt="Delare" />
                <div style={popup.DividerLineCase}></div>
              </div>
            }

            {/* If there is an open data link but no PDF case nor report link, make a red divider */}
            {!pin.openData || pin.pdfCase ? null :
              <div style={popup.Divider}>
                <div style={popup.DividerLineOpen}></div>
                <Image width={25} height={25} src="/images/dividers/infored.svg" alt="Delare" />
                <div style={popup.DividerLineOpen}></div>
              </div>
            }

            {/* If there is an Energiportalen link, make an orange divider */}
            {!pin.identity ? null :
              <div style={popup.Divider}>
                <div style={popup.DividerLineEP}></div>
                <Image width={25} height={25} src="/images/dividers/sun.svg" alt="Delare" />
                <div style={popup.DividerLineEP}></div>
              </div>
            }
            {!pin.pdfCase ? null :
              <div style={popup.AlignLinks}>
                <a href={pin.pdfCase} target="_blank" rel="noreferrer">
                  <span style={popup.PopupLinkPdf}>
                    <Image width={30} height={30} src="/images/categories/case.svg" alt="Case" />
                  </span>
                </a>
                Case
              </div>}

            {!pin.openData ? null :
              <div style={popup.AlignLinks}>
                <a href={pin.openData} target="_blank" rel="noreferrer">
                  <span style={popup.PopupLinkOpenData}>
                    <Image width={30} height={30} src="/images/categories/dataicon.svg" alt="Öppna data" />
                  </span>
                </a>
                Öppna data
              </div>}

            {!pin.identity ? null :
              <div style={popup.AlignLinks}>
                <a href={"https://energiportalregionuppsala.se/about?device=" + pin.identity} target="_blank" rel="noreferrer">
                  <span style={popup.PopupLinkEP}>
                    <Image width={30} height={30} src="/images/categories/lightbulb.svg" alt="Energiportalen" />
                  </span>
                </a>
                Energiportalen
              </div>}
          </div>
        </div>
      </div>
    </Popup>
  )
}

// Arrays of all different color pins and categories in matching order. Used to color pins based on category
const iconArray = [pinIcons.IconPinPurple, pinIcons.IconPinTeal, pinIcons.IconPinPink, pinIcons.IconPinViolet, pinIcons.IconPinAzure, pinIcons.IconPinGreenBlue, pinIcons.IconPinRed, pinIcons.IconPinYellowGreen, pinIcons.IconPinYellow, pinIcons.IconPinGreen, pinIcons.IconPinOrange, pinIcons.IconPinBlue, pinIcons.IconPinGray];
const categoryArray = ["Bygg och anläggning", "Grön energi", "Hållbarhet", "Social hållbarhet", "Mobilitet", "Elnät", "Hälsa och bioteknik", "Miljöteknik", "Energilagring", "Agrara näringar", "Livsmedel", "Vatten och avlopp", "Övrigt"]

/**
 * Function that returns an icon for a pin based on the category of the pin
 * 
 * If the pin has multiple categories, it will return the icon for its first category
 * 
 * If the pin has no category, it will return the default white pin
 * @param pin The pin to get the icon for
 * @param currentFilter Used to check if the pin has a category that matches with the first category in the filter
 * @returns Matching color icon for the pin's category or the default white pin
 */
function getIcon(pin: DeepStory, currentFilter: StoryFilter) {
  // Changes color of all displayed pins to match with the first matching category in the current filter, if any
  for (let i in categoryArray) {
    for (let j in currentFilter.categories) {
      if (currentFilter.categories && String(currentFilter.categories[j as keyof typeof currentFilter.categories])?.toLowerCase().includes(categoryArray[i].toLowerCase()) && pin.categorySwedish?.toLowerCase().includes(categoryArray[i].toLowerCase())) {
        return iconArray[i]
      }
    }
  }
  // Loop through all categories in the pin and return the first matching category
  for (let i in categoryArray) {
    if (pin.categorySwedish?.toLowerCase().includes(categoryArray[i].toLowerCase())) {
      return iconArray[i]
    }
  }
  // If the pin has no matching category, return the default white pin
  return pinIcons.IconPinWhite
}

/**
 * Creates markers for all pins that pass the active filters
 * @param mapData Array of DeepStory objects, containing all the data for the pins
 * @param currentFilter Currently active filters
 * @param searchInput The current text in the search bar
 * @returns JSX.Element
 */
export function storiesPins(mapData: DeepStory[], solarData: any[], currentFilter: StoryFilter, searchInput: string | undefined) {
  if (searchInput) {
    currentFilter = { ...currentFilter, searchInput: searchInput }
  }

  let combinedData = [...mapData, ...solarData] as any as DeepStory[]

  let filteredData = runActiveFilters(combinedData, currentFilter)

  return filteredData.map((pin: DeepStory, pinIndex: number) => {
    if (!pin.mapItem.latitude || !pin.mapItem.longitude) {
      return null
    } else {
      return (
        <Marker key={pin.id} position={[pin.mapItem.latitude!, pin.mapItem.longitude!]} icon={getIcon(pin, currentFilter)}>
          {pin ? storiesPopup(pin) : null}
        </Marker>
      )
    }
  })
}