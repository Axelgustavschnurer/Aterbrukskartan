import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "../dualSlider/dualSlider";
import { RecycleFilter } from "@/types";
import { yearLimitsRecycle } from "@/pages/aterbruk";
import styles from "./aside.module.css";
import {
  createProjectTypeFilter,
  createLookingForFilter,
  createAvailableFilter,
} from "@/components/aside/recycleSidebar";
import { Badge, Button, Collapse } from "@nextui-org/react";
import { Data } from "@/session";

// TODO: Label functions exist both here and in index.tsx, fix this
// TODO: Label functions should probably not work that way :)

/**
 * Sidebar component
 * @param setFilter Function to set the `filter` state
 * @param currentMap String containing the current map for conditional rendering
 * @param user Object containing the user's session data
 * @returns JSX.Element
 */
export default function Sidebar({ monthArray, maxCategoryAmount, currentFilter, setFilter, currentMap, user }: { monthArray?: any, maxCategoryAmount: any, currentFilter: any, setFilter: Function, currentMap: string, user: Data['user'] }) {
  // Handles the state of the sidebar's visibility
  const [isOpen, setOpen] = useState(true);

  // List of all pins in the database
  const [mapData, setMapData] = useState([]);

  // State of the year slider
  const [years, setYears] = useState([] as number[]);

  // State of the month slider
  const [months, setMonths] = useState([] as number[]);

  // List of all active filters for the field `projectType`
  const [projectType, setProjectType] = useState([] as string[]);

  // List of all active filters for the field `storyCategory`
  const [storyCategory, setStoryCategory] = useState([] as string[]);

  // List of all active filters for the field `educationalProgram`
  const [educationalProgram, setEducationalProgram] = useState([] as string[]);

  // List of all active filters for the field `educationalSpecialisation`
  const [educationalSpecialisation, setEducationalSpecialisation] = useState(
    [] as string[]
  );

  const [isRealStory, setIsRealStory] = useState(false as boolean);

  const [hasSolarData, setHasSolarData] = useState(false as boolean);

  // List of all active filters for the field `Rapport`
  const [hasReport, setHasReport] = useState(false as boolean);

  // List of all active filters for the field `Videos`
  const [hasVideo, setHasVideo] = useState(false as boolean);

  // List of all active filters for the field `Case`
  const [hasCase, setHasCase] = useState(false as boolean);

  // List of all active filters for the field `Open Data`
  const [hasOpenData, setHasOpenData] = useState(false as boolean);

  // List of all active filters for the field `lookingForMaterials`
  const [lookingForMaterials, setLookingForMaterials] = useState(
    [] as string[]
  );
  // List of all active filters for the field `availableMaterials`
  const [availableMaterials, setAvailableMaterials] = useState([] as string[]);

  // List of all active filters for the field `organisation`
  const [organisation, setOrganisation] = useState([] as string[]);

  // Boolean to indicate if only inactive pins should be shown
  const [showInactive, setShowInactive] = useState(false as boolean);

  // Boolean to indicate if only pins with attachments should be shown
  const [showAttachment, setShowAttachment] = useState(false as boolean);

  // State to check when the year slider are at it's default values
  const [yearSliderDefault, setYearSliderDefault] = useState(true as boolean);

  // State to check when the month slider are at it's default values
  const [monthSliderDefault, setMonthSliderDefault] = useState(true as boolean);

  // State of when to reset the range sliders
  const [sliderReset, setSliderReset] = useState(false as boolean);

  // State of when the reset button should be active
  const [disableReset, setDisableReset] = useState({
    projectType: true,
    lookingForMaterials: true,
    availableMaterials: true,
    organisation: true,
    storyCategory: true,
    educationalProgram: true,
    hasSolarData: true,
  } as any);

  /** Fetches data from the database on component mount and if currentMap prop somehow changes */
  useEffect(() => {
    async function fetchData() {
      if (currentMap === "Stories") {
        const response = await fetch("/api/stories");
        const data = await response.json();
        setMapData(data);
      } else if (currentMap === "Recycle") {
        const response = await fetch("/api/recycle");
        const data = await response.json();
        setMapData(data);
      }
    }
    fetchData();
  }, [currentMap]);

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
    setFilter({
      projectType: projectType,
      years: years,
      months: months,
      lookingForCategories: lookingForMaterials,
      availableCategories: availableMaterials,
      organisation: organisation,
      showInactive: showInactive,
      attachment: showAttachment,
    } as RecycleFilter);
  }, [
    projectType,
    years,
    months,
    lookingForMaterials,
    availableMaterials,
    organisation,
    setFilter,
    storyCategory,
    currentMap,
    educationalProgram,
    educationalSpecialisation,
    hasVideo,
    hasReport,
    hasCase,
    hasOpenData,
    isRealStory,
    hasSolarData,
    showInactive,
    showAttachment,
  ]);


  /**
     * Returns a Badge component from nextui with the currently active project type filters, if any
     * 
     * If the amount of selected categories is greater than maxCategoryAmount, the label will be compacted
     * to only display the amount of selected projecttypes
     */
  const projectTypeLabel = () => {
    if (currentFilter.projectType?.length) {
      if (currentFilter.projectType.length > maxCategoryAmount) {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "navy", color: "bone", }}>{currentFilter.projectType.length} projekttyper</Badge>
        )
      }
      else {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "navy", color: "bone" }}>{currentFilter.projectType.join(", ")}</Badge>
        )
      }
    }
  }

  /**
   * Returns a Badge component from nextui with the currently active year filters, if any
   * 
   * If the year slider is at its default value, the label will not be displayed
   * If the year slider is at a value where the min and max values are the same, the label will be compacted to only display the single year
   */
  const yearLabel = () => {
    if (currentMap == 'Recycle') {
      if (currentFilter.years?.length) {
        if (Math.min(...currentFilter.years) === yearLimitsRecycle.min && Math.max(...currentFilter.years) === yearLimitsRecycle.max) {
          return null;
        }
        else if (currentFilter.years[0] === currentFilter.years[1] && currentFilter.years[0] !== undefined) {
          return (
            <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "#fd9800", color: "bone" }}>År: {currentFilter.years[0]}</Badge>
          )
        }
        else {
          return (
            <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "#fd9800", color: "bone" }}>År: {Math.min(...currentFilter.years)} - {Math.max(...currentFilter.years)}</Badge>
          )
        }
      }
    }
  }

  /**
   * Returns a Badge component from nextui with the currently active month filters, if any
   * 
   * If the month slider is at its default value, the label will not be displayed
   * If the month slider is at a value where the min and max values are the same, the label will be compacted to only display the single month
   */
  const monthLabel = () => {
    if (currentFilter.months?.length) {
      if (Math.min(...currentFilter.months) === 1 && Math.max(...currentFilter.months) === 12) {
        return null;
      }
      else if (currentFilter.months[0] === currentFilter.months[1] && currentFilter.months[0] !== undefined) {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "violet", color: "bone" }}>Månad: {monthArray[currentFilter.months[0] - 1]}</Badge>
        )
      }
      else {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "violet", color: "bone" }}>Månader: {monthArray[Math.min(...currentFilter.months) - 1]} - {monthArray[Math.max(...currentFilter.months) - 1]}</Badge>
        )
      }
    }
  }


  /**
   * Returns a Badge component from nextui with the currently active filters regarding materials that are being searched for by the projects on the map, if any
   * 
   * If the amount of selected material categories is greater than maxCategoryAmount, the label will be compacted
   * to only display the amount of selected material categories
   */
  const lookingForMaterialsLabel = () => {
    if (currentFilter.lookingForCategories?.length) {
      if (currentFilter.lookingForCategories.length > maxCategoryAmount) {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "green", color: "bone" }}>Sökes: {currentFilter.lookingForCategories.length} kategorier</Badge>
        )
      }
      else {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "green", color: "bone" }}>Sökes: {currentFilter.lookingForCategories.join(", ")}</Badge>
        )
      }
    }
  }

  /**
   * Returns a Badge component from nextui with the currently active filters regarding available materials, if any
   * 
   * If the amount of selected material categories is greater than maxCategoryAmount, the label will be compacted
   * to only display the amount of selected material categories
   */
  const availableMaterialsLabel = () => {
    if (currentFilter.availableCategories?.length) {
      if (currentFilter.availableCategories.length > maxCategoryAmount) {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "crimson", color: "bone" }}>Erbjuds: {currentFilter.availableCategories.length} kategorier</Badge>
        )
      }
      else {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "crimson", color: "bone" }}>Erbjuds: {currentFilter.availableCategories.join(", ")}</Badge>
        )
      }
    }
  }

  /**
   * Returns a Badge component from nextui with the currently active filters regarding organisations, if any
   * 
   * If the amount of selected organisations is greater than maxCategoryAmount, the label will be compacted
   * to only display the amount of selected organisations, Works for both Stories and Recycle
   */
  const organisationLabel = () => {
    if (currentFilter.organisation?.length) {
      if (currentFilter.organisation.length > maxCategoryAmount) {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "teal", color: "bone" }}>{currentFilter.organisation.length} Organisationer</Badge>
        )
      }
      else {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "teal", color: "bone" }}>Organisationer: {currentFilter.organisation.join(", ")}</Badge>
        )
      }
    }
  }

  /**
   * Returns a Badge component from nextui with the currently active filters regarding showing inactive projects, if any
   * 
   * If the showInactive filter is true, the label will be displayed
   */
  const showInactiveLabel = () => {
    if (currentFilter.showInactive) {
      return (
        <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "black", color: "bone" }}>Visar inaktiva objekt</Badge>
      )
    }
  }

  /**
   * Creates checkboxes for all the different organisations in the database
   */
  const createOrganisationFilter = () => {
    let mappedData = mapData.map((pin: any) => pin.mapItem.organisation);
    let filteredData = mappedData
      .filter(
        (pin: any, index: any) =>
          mappedData.indexOf(pin) === index && !!mappedData[index]
      )
      .sort();
    return (
      <>
        <Collapse title="Organisation" divider={false} subtitle="Tryck för att expandera / minimera">
          {filteredData.map((pin: any) => {
            return (
              <div id={styles.inputGroupOrg} className={styles.input} key={pin}>
                <input
                  id={pin}
                  name={pin}
                  type="checkbox"
                  checked={organisation.includes(pin)}
                  onChange={(e) => {
                    // If the checkbox is now unchecked and the organisation is in the organisation array, remove it from the array
                    if (
                      organisation.includes(e.target.name) &&
                      !e.target.checked
                    ) {
                      setOrganisation(
                        organisation.filter(
                          (item: any) => item !== e.target.name
                        )
                      );
                      // If the array only contains one item or less, disable the reset button. We have to check check if the array has at least one item because the state is updated on the next render
                      if (organisation.length <= 1) {
                        setDisableReset({
                          ...disableReset,
                          organisation: true,
                        });
                      }
                    }
                    // If the checkbox is now checked and the organisation is not in the organisation array, add it to the array
                    else if (
                      !organisation.includes(e.target.name) &&
                      e.target.checked
                    ) {
                      setOrganisation([...organisation, e.target.name]);
                      // Enable the reset button when a filter is active
                      setDisableReset({ ...disableReset, organisation: false });
                    }
                  }}
                />
                <label htmlFor={pin} style={{ margin: "0", }}>{pin}</label>
              </div>
            );
          })}
        </Collapse>
      </>
    );
  };

  return (
    <>

      {/* Button for clearing the current filter. Disabled when no filter is active */}
      <div className="flex gap-100 justify-content-space-between align-items-center">
        <h3>Aktiva filter</h3>
        <button
          style={{
            backgroundColor: 'transparent',
            borderRadius: '9999px',

          }}
          disabled={
            disableReset.projectType &&
            disableReset.lookingForMaterials &&
            disableReset.availableMaterials &&
            disableReset.organisation &&
            disableReset.storyCategory &&
            disableReset.educationalProgram &&
            disableReset.educationalSpecialisation &&
            !isRealStory &&
            !hasCase &&
            !hasReport &&
            !hasOpenData &&
            !hasVideo &&
            !hasSolarData &&
            !showInactive &&
            !showAttachment &&
            yearSliderDefault &&
            monthSliderDefault
          }
          onClick={() => {
            setProjectType([]);
            setSliderReset(true);
            setLookingForMaterials([]);
            setAvailableMaterials([]);
            setOrganisation([]);
            setStoryCategory([]);
            setEducationalProgram([]);
            setEducationalSpecialisation([]);
            setHasVideo(false);
            setHasReport(false);
            setHasCase(false);
            setHasOpenData(false);
            setIsRealStory(false);
            setHasSolarData(false);
            setShowInactive(false);
            setShowAttachment(false);
            setDisableReset({
              projectType: true,
              lookingForMaterials: true,
              availableMaterials: true,
              organisation: true,
              storyCategory: true,
              educationalProgram: true,
              educationalSpecialisation: true,
            });

            let checkboxes = document.querySelectorAll(
              "input[type=checkbox]"
            );
            checkboxes.forEach((checkbox: any) => {
              checkbox.checked = false;
            });
          }}
        >
          Rensa filter
        </button>
      </div>

      <div className="flex gap-50" style={{flexDirection: 'column'}}>
        {projectTypeLabel()}
        {yearLabel()}
        {monthLabel()}
        {lookingForMaterialsLabel()}
        {availableMaterialsLabel()}
        {organisationLabel()}
        {showInactiveLabel()}
      </div>


      <h3>Projekttyper</h3>
      {/* Buttons for choosing project types to filter by */}
      <div className={styles.filterButtons}>
        {createProjectTypeFilter(projectType, setProjectType, disableReset, setDisableReset)}
      </div>

      <h3>År</h3>
      {/* Range slider for year filter */}
      <div className={styles.rSliderContainer}>
        <DualRangeSlider
          min={yearLimitsRecycle.min}
          max={yearLimitsRecycle.max}
          onChange={({ min, max }: any) => {
            if (years.includes(yearLimitsRecycle.min) && years.includes(yearLimitsRecycle.max)) {
              setYearSliderDefault(true);
            } else {
              setYearSliderDefault(false);
            }

            if (!(years.includes(min) && years.includes(max)) || (min === max && !(years[0] === min && years[1] === max))) {
              setYears([min, max]), setSliderReset(false);
            }
          }}
          reset={sliderReset}
        />
      </div>

      {/*This is a range slider for months filter. Recycle map only */}
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
            if (months.includes(1) && months.includes(12)) {
              setMonthSliderDefault(true);
            } else {
              setMonthSliderDefault(false);
            }
            if (!(months.includes(min) && months.includes(max)) || (min === max && !(months[0] === min && months[1] === max))
            ) {
              setMonths([min, max]), setSliderReset(false);
            }
          }}
          reset={sliderReset}
        />
      </div>

      <form className={styles.form}>
        {/* A button for only showing pins with attachments. Currently recycle map only */}
        <h3>Bilagor</h3>
        <div className={styles.input}>
          <input
            id="showAttached"
            name="showAttached"
            type="checkbox"
            checked={showAttachment}
            onChange={(e) => {
              if (e.target.checked) {
                setShowAttachment(true);
              } else {
                setShowAttachment(false);
              }
            }}
          />
          <label htmlFor="showAttached" style={{ margin: "0", }}>Visa bara inlägg med bilaga</label>
        </div>

        {/* Checkboxes for filtering materials and organisations */}
        <span>
          <h3>Erbjuds</h3>{" "}
          {createAvailableFilter(
            mapData,
            availableMaterials,
            setAvailableMaterials,
            disableReset,
            setDisableReset
          )}{" "}
          <h3>Sökes</h3>{" "}
          {createLookingForFilter(
            mapData,
            lookingForMaterials,
            setLookingForMaterials,
            disableReset,
            setDisableReset
          )}
        </span>
        {createOrganisationFilter()}

        {/* Admin-only button to filter for disabled pins */}
        {user && user.isAdmin && (
          <>
            <div className={styles.input}>
              <input
                id="showDisabled"
                name="showDisabled"
                type="checkbox"
                checked={showInactive}
                onChange={(e) => {
                  if (e.target.checked) {
                    setShowInactive(true);
                  } else {
                    setShowInactive(false);
                  }
                }}
              />
              <label htmlFor="showDisabled" style={{ margin: "0", }}>Visa bara inaktiva inlägg</label>
            </div>
          </>
        )
        }
      </form>
    </>
  );
}