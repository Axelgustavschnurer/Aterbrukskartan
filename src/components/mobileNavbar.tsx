import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "./dualSlider";
import { RecycleFilter, StoryFilter } from "@/types";
import Image from "next/image";
import { yearLimitsRecycle } from "@/pages/aterbruk";
import { yearLimitsStories } from "@/pages";
import {
  createMobileProjectTypes,
  createLookingForFilter,
  createAvailableFilter,
} from "@/functions/recycleSidebar";
import {
  createMobileCategories,
  createEducationalFilter,
  createMiscFilter,
} from "@/functions/storiesSidebar";
import { Button, Collapse } from "@nextui-org/react";

import mobileStyles from "../styles/mobileSidebar.module.css";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";

export default function MobileSidebar({ setFilter, currentMap, energiportalen }: any) {
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
  } as any);



  // Runs fetchData function on component mount
  useEffect(() => {
    /** Fetches data from the database */
    const fetchData = async () => {
      if (currentMap === "Stories") {
        const response = await fetch("/api/stories");
        const data = await response.json();
        setMapData(data);
      } else if (currentMap === "Recycle") {
        const response = await fetch("/api/recycle");
        const data = await response.json();
        setMapData(data);
      }
    };
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
        solarData: hasSolarData
      } as StoryFilter);
    } else if (currentMap === "Recycle") {
      setFilter({
        projectType: projectType,
        years: years,
        months: months,
        lookingForCategories: lookingForMaterials,
        availableCategories: availableMaterials,
        organisation: organisation,
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
  ]);

  /**
   * Creates checkboxes for all education specialisations in the database
   */
  const createSpecialisationFilter = () => {
    let mappedData = mapData.map((pin: any) => pin.educationalProgram);
    // Matches all characters before the first comma, the comma itself, and all immediately following whitespace
    // Used to separate the specialisation from the combined program name by removing the program name
    // Example: "Civilingenjör, Industriell ekonomi" -> "Industriell ekonomi"
    const programRegex = /^[^,]*?,\s*/
    let specialisations = mappedData.map((program: any) => !!program ? setFirstLetterCapital(program.replace(programRegex, "")) : "");
    let filteredData = specialisations
      .filter(
        (specialisation: any, index: any) =>
          specialisations.indexOf(specialisation) === index && !!specialisations[index]
      )
      .sort();
    return (
      <>
        <Collapse title="Specialisering" divider={false} subtitle="Tryck för att expandera / minimera">
          {filteredData.map((specialisation: any) => {
            return (
              <div id={mobileStyles.inputGroupOrg} className={mobileStyles.inputGroup} key={specialisation}>
                <input
                  id={specialisation}
                  name={specialisation}
                  type="checkbox"
                  onChange={(e) => {
                    // If the checkbox is now unchecked and the specialisation is in the specialisation array, remove it from the array
                    if (
                      educationalSpecialisation.includes(e.target.name) &&
                      !e.target.checked
                    ) {
                      setEducationalSpecialisation(
                        educationalSpecialisation.filter(
                          (specialisation: any) => specialisation !== e.target.name
                        )
                      );
                      if (educationalSpecialisation.length <= 1) {
                        setDisableReset({
                          ...disableReset,
                          educationalSpecialisation: true,
                        });
                      }
                    }
                    // If the checkbox is now checked and the specialisation is not in the specialisation array, add it to the array
                    else if (
                      !educationalSpecialisation.includes(e.target.name) &&
                      e.target.checked
                    ) {
                      setEducationalSpecialisation([
                        ...educationalSpecialisation,
                        e.target.name,
                      ]);
                      // Enable the reset button since there is now a filter active
                      setDisableReset({
                        ...disableReset,
                        educationalSpecialisation: false,
                      });
                    }
                  }}
                />
                <label htmlFor={specialisation}>{specialisation}</label>
              </div>
            );
          })}
        </Collapse>
      </>
    );
  };

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
              <div id={mobileStyles.inputGroupOrg} className={mobileStyles.inputGroup} key={pin}>
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
                <label htmlFor={pin}>{pin}</label>
              </div>
            );
          })}
        </Collapse>
      </>
    );
  };

  return (
    <>
      {energiportalen && !hasSolarData ? setHasSolarData(true) : energiportalen && hasSolarData ? null : (
        <>
          <input type="checkbox" id="navi-toggle" className={mobileStyles.checkbox} />
          <label htmlFor="navi-toggle" className={mobileStyles.button}>
            <span className={mobileStyles.icon}>&nbsp;</span>
          </label>
          <div className={mobileStyles.background}>&nbsp;</div>

          <nav className={mobileStyles.nav}>
            <div className={mobileStyles.sidebar}>
              <div className={mobileStyles.topHeader}>
                {currentMap === "Stories" ? (
                  <h3>Kategorier</h3>
                ) : currentMap === "Recycle" ? (
                  <h3>Projekttyper</h3>
                ) : null}
              </div>
              {/* Buttons for choosing project types to filter by */}
              <div className={mobileStyles.form}>
                {currentMap === "Stories"
                  ? createMobileCategories(
                    storyCategory,
                    setStoryCategory,
                    disableReset,
                    setDisableReset
                  )
                  : currentMap === "Recycle"
                    ? createMobileProjectTypes(
                      projectType,
                      setProjectType,
                      disableReset,
                      setDisableReset
                    )
                    : null}
              </div>

              <div className={mobileStyles.sidebarHeader}>
                <div className={mobileStyles.sidebarTitle}>
                  <h3>År</h3>
                </div>
              </div>
              {/* Range slider for year filter */}
              <div className={mobileStyles.rSliderContainer}>
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
                  <div className={mobileStyles.sidebarHeader}>
                    <div className={mobileStyles.sidebarTitle}>
                      <h3>Månad</h3>
                    </div>
                  </div>
                  <div className={mobileStyles.rSliderContainer}>
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

              {/* Checkboxes for filtering materials and organisations */}
              <form className={mobileStyles.form}>
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
                  </span>
                ) : null}
                {createOrganisationFilter()}
              </form>

              {/* Button for clearing the current filter. Disabled when no filter is active */}
              <div className={mobileStyles.clearFilter}>
                <Button
                  id={mobileStyles.clearBtn}
                  css={{ width: "100%" }}
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
                      "input[type=checkbox]:not([id=navi-toggle])"
                    );
                    checkboxes.forEach((checkbox: any) => {
                      checkbox.checked = false;
                    });
                  }}
                >
                  Rensa filter
                </Button>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  )
}