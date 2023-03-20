import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "./dualSlider";
import { RecycleFilter, StoryFilter } from "@/types";
import Image from "next/image";
import { yearLimitsRecycle } from "@/pages/aterbruk";
import { yearLimitsStories } from "@/pages/stories";
import styles from "../styles/sidebar.module.css";
import { createProjectTypeFilter, createLookingForFilter, createAvailableFilter } from "@/functions/recycleSidebar";
import { createCategoryFilter, createEducationalFilter, createMiscFilter } from "@/functions/storiesSidebar";
import { Button } from "@nextui-org/react";

// Sidebar component for filtering the map

export default function Sidebar({ setFilter, currentMap }: any) {
  // Handles the state of the sidebar's visibility
  const [isOpen, setOpen] = useState(true);

  // List of all pins in the database
  const [mapData, setMapData] = useState([])

  // State of the year slider
  const [years, setYears] = useState([] as number[])

  // State of the month slider
  const [months, setMonths] = useState([] as number[])

  // List of all active filters for the field `projectType`
  const [projectType, setProjectType] = useState([] as string[])

  // List of all active filters for the field `storyCategory`
  const [storyCategory, setStoryCategory] = useState([] as string[])

  // List of all active filters for the field `educationalProgram`
  const [educationalProgram, setEducationalProgram] = useState([] as string[])

  const [isEnergy, setIsEnergy] = useState(false as boolean)

  // List of all active filters for the field `Rapport`
  const [hasReport, setHasReport] = useState(false as boolean)

  // List of all active filters for the field `Videos`
  const [hasVideo, setHasVideo] = useState(false as boolean)

  // List of all active filters for the field `Case`
  const [hasCase, setHasCase] = useState(false as boolean)

  // List of all active filters for the field `lookingForMaterials`
  const [lookingForMaterials, setLookingForMaterials] = useState([] as string[])

  // List of all active filters for the field `availableMaterials`
  const [availableMaterials, setAvailableMaterials] = useState([] as string[])

  // List of all active filters for the field `organisation`
  const [organisation, setOrganisation] = useState([] as string[])

  // State of when to reset the range sliders
  const [sliderReset, setSliderReset] = useState(false as boolean)

  // State of when the reset button should be active
  const [disableReset, setDisableReset] = useState(true as boolean)

  /**
   * Fetches data from the database
   */
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

  // Toggles the sidebar's visibility when called
  const toggleMenu = () => {
    setOpen(!isOpen);
  };

  // Closes the sidebar when the user navigates to a new page
  const router = useRouter();
  useEffect(() => {
    const closeMenu = () => isOpen && setOpen(false);
    router.events.on("routeChangeStart", closeMenu);
    return () => {
      router.events.off("routeChangeStart", closeMenu);
    };
  }, [isOpen, router]);

  // Updates filter state when the user interacts with any of the filter components
  useEffect(() => {
    if (currentMap === "Stories") {
      setFilter({
        years: years,
        organisation: organisation,
        categories: storyCategory,
        educationalProgram: educationalProgram,
        video: hasVideo,
        report: hasReport,
        cases: hasCase,
        energyStory: isEnergy,
      } as StoryFilter)
    }
    else if (currentMap === "Recycle") {
      setFilter({
        projectType: projectType,
        years: years,
        months: months,
        lookingForCategories: lookingForMaterials,
        availableCategories: availableMaterials,
        organisation: organisation,
      } as RecycleFilter)
    }
  }, [projectType, years, months, lookingForMaterials, availableMaterials, organisation, setFilter, storyCategory, currentMap, educationalProgram, hasVideo, hasReport, hasCase, isEnergy])


  /**
   * Creates checkboxes for all the different organisations in the database
   */
  const createOrganisationFilter = () => {
    let mappedData = mapData.map((pin: any) => pin.mapItem.organisation)
    let filteredData = mappedData.filter((pin: any, index: any) => mappedData.indexOf(pin) === index && !!mappedData[index]).sort()
    return (
      <>
        {filteredData.map((pin: any) => {
          return (
            <div className={styles.inputGroup} key={pin}>
              <input
                id={pin}
                name={pin}
                type="checkbox"
                onChange={(e) => {
                  // If the checkbox is now unchecked and the organisation is in the organisation array, remove it from the array
                  if (organisation.includes(e.target.name) && !e.target.checked) {
                    setOrganisation(organisation.filter((item: any) => item !== e.target.name))
                    // If the array only contains one item or less, disable the reset button. We have to check check if the array has at least one item because the state is updated on the next render
                    if (organisation.length <= 1) {
                      setDisableReset(true)
                    }
                  }
                  // If the checkbox is now checked and the organisation is not in the organisation array, add it to the array
                  else if (!organisation.includes(e.target.name) && e.target.checked) {
                    setOrganisation([...organisation, e.target.name])
                    // Enable the reset button when a filter is active
                    setDisableReset(false)
                  }
                }}
              />
              <label htmlFor={pin}>{pin}</label>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <>
      {isOpen && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            {currentMap === "Stories" ? <h3>Kategorier</h3> : currentMap === "Recycle" ? <h3>Projekttyper</h3> : null}
          </div>
          {/* Buttons for choosing project types to filter by */}
          <div className={styles.filterBtn}>
            {currentMap === "Stories" ? createCategoryFilter(storyCategory, setStoryCategory, setDisableReset) : currentMap === "Recycle" ? createProjectTypeFilter(projectType, setProjectType, setDisableReset) : null}
          </div>

          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitle}>
              <h3>År</h3>
            </div>
          </div>
          {/* Range slider for year filter */}
          <div className={styles.rSliderContainer}>
            <DualRangeSlider
              min={currentMap === "Stories" ? yearLimitsStories.min : currentMap === "Recycle" ? yearLimitsRecycle.min : null}
              max={currentMap === "Stories" ? yearLimitsStories.max : currentMap === "Recycle" ? yearLimitsRecycle.max : null}
              onChange={({ min, max }: any) => {
                if (!(years.includes(min) && years.includes(max)) || (min === max && !(years[0] === min && years[1] === max))) {
                  setYears([min, max]), setSliderReset(false)
                }
              }}
              reset={sliderReset}
            />
          </div>

          {/*This is a range slider for months filter. Recycle map only */}
          {currentMap === "Recycle" ?
            <>
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarTitle}>
                  <h3>Månad</h3>
                </div>
              </div>
              <div className={styles.rSliderContainer}>
                <DualRangeSlider
                  min={1}
                  max={12}
                  onChange={({ min, max }: any) => {
                    if (!(months.includes(min) && months.includes(max)) || (min === max && !(months[0] === min && months[1] === max))) {
                      setMonths([min, max]), setSliderReset(false)
                    }
                  }}
                  reset={sliderReset}
                />
              </div>
            </>
            : null}

          {/* Checkboxes for filtering materials and organisations */}
          <form className={styles.form}>
            {currentMap === "Recycle" ? <span><h3>Erbjuds</h3> {createAvailableFilter(mapData, availableMaterials, setAvailableMaterials, setDisableReset)} <h3>Sökes</h3> {createLookingForFilter(mapData, lookingForMaterials, setLookingForMaterials, setDisableReset)}</span>
              : currentMap === "Stories" ? <span><h3>Projekt innehåll</h3> {createMiscFilter(hasReport, setHasReport, hasVideo, setHasVideo, hasCase, setHasCase, isEnergy, setIsEnergy)} <h3>Utbildningsprogram</h3> {createEducationalFilter(educationalProgram, setEducationalProgram)}</span>
                : null}

            <h3>Organisation</h3>
            {createOrganisationFilter()}
          </form>

          {/* Button for clearing the current filter. Disabled when no filter is active */}
          <div className={styles.clearFilter}>
            <Button
              id={styles.clearBtn}
              disabled={disableReset}
              onPress={() => {
                setProjectType([])
                setSliderReset(true)
                setLookingForMaterials([])
                setAvailableMaterials([])
                setOrganisation([])
                setStoryCategory([])
                setEducationalProgram([])
                setHasVideo(false)
                setHasReport(false)
                setHasCase(false)
                setIsEnergy(false)
                setDisableReset(true)

                let checkboxes = document.querySelectorAll("input[type=checkbox]")
                checkboxes.forEach((checkbox: any) => {
                  checkbox.checked = false
                })
              }}>
              Rensa filter
            </Button>
          </div>

          {/* Button for closing the sidebar */}
          <div className={styles.sidebarClose}>
            <button
              id={styles.hideBtn}
              onClick={toggleMenu}>
              <Image src="/closeArrow.svg" alt="Closing arrow" width={20} height={20} />
            </button>
          </div>

        </div>
      )
      }

      {/* Button for opening the sidebar when it's closed */}
      {
        !isOpen && (
          <div className={styles.hiddenSidebar}>
            <div className={styles.sidebarOpen}>
              <button
                id={styles.openBtn}
                onClick={toggleMenu}>
                <Image src="/openArrow.svg" alt="Open arrow" width={20} height={20} />
              </button>
            </div>
          </div>
        )
      }
    </>
  );
}