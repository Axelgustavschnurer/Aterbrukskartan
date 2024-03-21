import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "../dualSlider/dualSlider";
import { RecycleFilter, StoryFilter } from "@/types";
import Image from "next/image";
import { yearLimitsRecycle } from "@/pages/aterbruk";
import { yearLimitsStories } from "@/pages/stories";
import styles from "./aside.module.css";
import {
  createProjectTypeFilter,
  createLookingForFilter,
  createAvailableFilter,
} from "@/components/aside/recycleSidebar";
import {
  createCategoryFilter,
  createEducationalFilter,
  createMiscFilter,
} from "@/components/aside/storiesSidebar";
import { Badge, Button, Collapse } from "@nextui-org/react";
import { Data } from "@/session";
import Link from "next/link";
import AlternatingLink from "./alternatingLink";


// TODO: Label functions exist both here and in index.tsx, fix this
// TODO: Label functions should probably not work that way :)

/**
 * Sidebar component
 * @param setFilter Function to set the `filter` state
 * @param currentMap String containing the current map for conditional rendering
 * @param energiportalen Boolean to check if the user is on the energiportalen page
 * @param user Object containing the user's session data
 * @returns JSX.Element
 */
export default function Sidebar({ monthArray, maxCategoryAmount, currentFilter, setFilter, currentMap, energiportalen, user }: { monthArray?: any, maxCategoryAmount: any, currentFilter: any, setFilter: Function, currentMap: string, energiportalen: boolean, user: Data['user'] }) {
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
        educationalSpecialisation: educationalSpecialisation,
        video: hasVideo,
        report: hasReport,
        cases: hasCase,
        openData: hasOpenData,
        energyStory: isRealStory,
        solarData: hasSolarData,
        showInactive: showInactive,
      } as StoryFilter);
    } else if (currentMap === "Recycle") {
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
    }
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
    if (currentMap == 'Stories') {
      if (currentFilter.years?.length) {
        if (Math.min(...currentFilter.years) === yearLimitsStories.min && Math.max(...currentFilter.years) === yearLimitsStories.max) {
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
   * Returns a Badge component from nextui with the currently active category filters, if any
   * 
   * If the amount of selected categories is greater than maxCategoryAmount, the label will be compacted
   * to only display the amount of selected projecttypes
   */
  const categoryLabel = () => {
    if (currentFilter.categories?.length) {
      if (currentFilter.categories.length > maxCategoryAmount) {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "navy", color: "bone" }}>{currentFilter.categories.length} Kategorier</Badge>
        )
      }
      else {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "navy", color: "bone" }}>Kategorier: {currentFilter.categories.join(", ")}</Badge>
        )
      }
    }
  }

  /**
   * Returns a Badge component from nextui with the currently active filters regarding project contents, if any
   * 
   * If the amount of selected project contents is greater than maxCategoryAmount, the label will be compacted
   * to only display the amount of selected project contents
   */
  const contentLabel = () => {
    if (currentFilter.report || currentFilter.video || currentFilter.cases || currentFilter.openData || currentFilter.energyStory || currentFilter.solarData && !energiportalen) {
      let content = []
      if (currentFilter.report) {
        content.push("Rapport")
      }
      if (currentFilter.video) {
        content.push("Video")
      }
      if (currentFilter.cases) {
        content.push("Case")
      }
      if (currentFilter.openData) {
        content.push("Öppna data")
      }
      if (currentFilter.energyStory) {
        content.push("Story")
      }
      if (currentFilter.solarData) {
        content.push("Energiportalen")
      }
      if (content.length > maxCategoryAmount) {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "crimson", color: "bone" }}>{content.length} innehåll</Badge>
        )
      }
      else {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "crimson", color: "bone" }}>Projekt innehåll: {content.join(", ")}</Badge>
        )
      }
    }
  }

  /**
   * Returns a Badge component from nextui with the currently active filters regarding educational programs, if any
   * 
   * If the amount of selected educational programs is greater than maxCategoryAmount, the label will be compacted
   * to only display the amount of selected educational programs
  */
  const educationLabel = () => {
    if (currentFilter.educationalProgram?.length) {
      if (currentFilter.educationalProgram.length > maxCategoryAmount) {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "green", color: "bone" }}>{currentFilter.educationalProgram.length} Utbildningar</Badge>
        )
      }
      else {
        return (
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "green", color: "bone" }}>Utbildningar: {currentFilter.educationalProgram.join(", ")}</Badge>
        )
      }
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
      {energiportalen && !hasSolarData ? setHasSolarData(true) : energiportalen && hasSolarData ? null : isOpen && (
        <div className={styles.sidebar}>
          <div>
            {currentMap === "Stories" ? (
              <h3>Kategorier</h3>
            ) : currentMap === "Recycle" ? (
              <h3>Projekttyper</h3>
            ) : null}
            {/* Buttons for choosing project types to filter by */}
            <div className={styles.filterButtons}>
              {currentMap === "Stories"
                ? createCategoryFilter(
                  storyCategory,
                  setStoryCategory,
                  disableReset,
                  setDisableReset
                )
                : currentMap === "Recycle"
                  ? createProjectTypeFilter(
                    projectType,
                    setProjectType,
                    disableReset,
                    setDisableReset
                  )
                  : null}
            </div>

            <h3>År</h3>

            {/* Range slider for year filter */}
            <div className={styles.rSliderContainer}>
              <DualRangeSlider
                min={
                  currentMap === "Stories"
                    ? yearLimitsStories.min
                    : currentMap === "Recycle"
                      ? yearLimitsRecycle.min
                      : null
                }
                max={
                  currentMap === "Stories"
                    ? yearLimitsStories.max
                    : currentMap === "Recycle"
                      ? yearLimitsRecycle.max
                      : null
                }
                onChange={({ min, max }: any) => {
                  if (
                    years.includes(
                      currentMap === "Stories"
                        ? yearLimitsStories.min
                        : currentMap === "Recycle"
                          ? yearLimitsRecycle.min
                          : 0
                    ) &&
                    years.includes(
                      currentMap === "Stories"
                        ? yearLimitsStories.max
                        : currentMap === "Recycle"
                          ? yearLimitsRecycle.max
                          : 0
                    )
                  ) {
                    setYearSliderDefault(true);
                  } else {
                    setYearSliderDefault(false);
                  }
                  if (
                    !(years.includes(min) && years.includes(max)) ||
                    (min === max && !(years[0] === min && years[1] === max))
                  ) {
                    setYears([min, max]), setSliderReset(false);
                  }
                }}
                reset={sliderReset}
              />
            </div>

            {/*This is a range slider for months filter. Recycle map only */}
            {currentMap === "Recycle" ? (
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
                      if (months.includes(1) && months.includes(12)) {
                        setMonthSliderDefault(true);
                      } else {
                        setMonthSliderDefault(false);
                      }
                      if (
                        !(months.includes(min) && months.includes(max)) ||
                        (min === max && !(months[0] === min && months[1] === max))
                      ) {
                        setMonths([min, max]), setSliderReset(false);
                      }
                    }}
                    reset={sliderReset}
                  />
                </div>
              </>
            ) : null}

            <form className={styles.form}>
              {/* A button for only showing pins with attachments. Currently recycle map only */}
              {currentMap === "Recycle" ? (
                <>
                  <h3>Bilagor</h3>
                  <div className={styles.input}>
                    <input
                      id="showAttached"
                      name="showAttached"
                      type="checkbox"
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
                </>
              ) : null}

              {/* Checkboxes for filtering materials and organisations */}
              {currentMap === "Recycle" ? (
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
              ) : currentMap === "Stories" ? (
                <span>
                  <h3>Projektinnehåll</h3>{" "}
                  {createMiscFilter(
                    hasReport,
                    setHasReport,
                    hasVideo,
                    setHasVideo,
                    hasCase,
                    setHasCase,
                    hasOpenData,
                    setHasOpenData,
                    isRealStory,
                    setIsRealStory,
                    hasSolarData,
                    setHasSolarData,
                  )}{" "}
                  <h3>Utbildningsprogram</h3>{" "}
                  {createEducationalFilter(
                    educationalProgram,
                    setEducationalProgram,
                    disableReset,
                    setDisableReset,
                    mapData.map((story: any) => story.educationalProgram)
                  )}
                  {/* {createSpecialisationFilter()} */}
                </span>
              ) : null}
              {createOrganisationFilter()}

              {/* Admin-only button to filter for disabled pins */}
              {user && user.isAdmin && (
                <>
                  <div className={styles.input}>
                    <input
                      id="showDisabled"
                      name="showDisabled"
                      type="checkbox"
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

            {/* Button for closing the sidebar */}
            <div className={styles.sidebarClose}>
              <button type="button" id={styles.hideBtn} onClick={toggleMenu}>
                <Image
                  src="/closeArrow.svg"
                  alt="Closing arrow"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Button for clearing the current filter. Disabled when no filter is active */}
      {energiportalen && !hasSolarData ? setHasSolarData(true) : energiportalen && hasSolarData ? null : isOpen && (
        <div className={styles.clearFilter}>
          <Button
            id={styles.clearBtn}
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
            onPress={() => {
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
          </Button>
        </div>
      )}

      {currentMap === "Stories" ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.25em' }}>
          {categoryLabel()}
          {yearLabel()}
          {contentLabel()}
          {educationLabel()}
          {organisationLabel()}
        </div>
      ) : currentMap === "Recycle" ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.25em' }}>
          {projectTypeLabel()}
          {yearLabel()}
          {monthLabel()}
          {lookingForMaterialsLabel()}
          {availableMaterialsLabel()}
          {organisationLabel()}
          {showInactiveLabel()}
        </div>
      ) : null}

      <AlternatingLink currentMap={currentMap} />

      {/* Button for opening the sidebar when it's closed */}
      {energiportalen ? null : !isOpen && (
        <div className={styles.hiddenSidebar}>
          <div className={styles.sidebarOpen}>
            <button type="button" id={styles.openBtn} onClick={toggleMenu}>
              <Image
                src="/openArrow.svg"
                alt="Open arrow"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      )}

    </>
  );
}
