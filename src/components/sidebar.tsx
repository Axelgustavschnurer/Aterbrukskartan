import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "./dualSlider";
import { Filter } from "@/types";
import Image from "next/image";
import { yearLimits } from "@/pages";

// Sidebar component for filtering the map

export default function Sidebar({ setFilter }: any) {
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

  // List of all active filters for the field `lookingForMaterials`
  const [lookingForMaterials, setLookingForMaterials] = useState([] as string[])

  // List of all active filters for the field `availableMaterials`
  const [availableMaterials, setAvailableMaterials] = useState([] as string[])

  // List of all active filters for the field `organisation`
  const [organisation, setOrganisation] = useState([] as string[])

  const [sliderReset, setSliderReset] = useState(false)

  /**
   * Fetches data from the database
   */
  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/getData')
    const data = await response.json()
    setMapData(data)
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
    setFilter({
      projectType: projectType,
      years: years,
      lookingForCategories: lookingForMaterials,
      availableCategories: availableMaterials,
      organisation: organisation,
    } as Filter)
  }, [projectType, years, lookingForMaterials, availableMaterials, organisation, setFilter])

  /**
   * Creates buttons for all the project categories defined in the array `categories` in this function
   */
  const createProjectTypeFilter = () => {
    let categories = [
      "Rivning",
      "Nybyggnation",
      "Ombyggnation",
    ]
    return (
      <>
        {categories.map((category: any) => {
          return (
            <div className="alignBtn" key={category}>
              <button
                id={category}
                onClick={(e: any) => {
                  if (projectType.includes(e.currentTarget.id)) {
                    setProjectType(projectType.filter((item: any) => item !== e.currentTarget.id))
                  } else {
                    setProjectType([...projectType, e.currentTarget.id])
                  }
                }}
              >
                <Image src={"/images/" + category.toLowerCase() + ".svg"} alt={category} width={40} height={40} />
              </button>
              <p>{category}</p>
            </div>
          )
        })}
      </>
    )
  }

  /**
   * Returns an array of all the different material categories in the database
   */
  const getAllMaterialCategories = () => {
    // List of all strings in the availableMaterials and lookingForMaterials fields
    let unsplitMaterials: string[] = []
    mapData.map((pin: any) => {
      if (pin.availableMaterials) {
        unsplitMaterials.push(pin.availableMaterials)
      }
      if (pin.lookingForMaterials) {
        unsplitMaterials.push(pin.lookingForMaterials)
      }
    })

    // Splits the strings into arrays and flattens them into one array
    let splitMaterials: string[] = []
    unsplitMaterials.map((material: any) => {
      splitMaterials.push(...material.split(',').map((item: any) => item.trim()))
    })

    // Removes duplicates and sorts the array
    let filteredMaterials = splitMaterials.filter((data: any, index: any) => splitMaterials.indexOf(data) === index && data).sort()

    return filteredMaterials
  }

  /**
   * Creates checkboxes for all the different lookingForMaterials categories in the database
   */
  const createLookingForFilter = () => {
    let categories = getAllMaterialCategories()
    return (
      <>
        {categories.map((category: any) => {
          return (
            <div className="inputGroup" key={category + "Sökes"}>
              <input
                id={category + "Sökes"}
                name={category + "Sökes"}
                type="checkbox"
                onChange={(e) => {
                  // If the checkbox is now checked and the category is not in the lookingForMaterials array, add it to the array
                  if (lookingForMaterials.includes(e.target.name.replace('Sökes', '')) && !e.target.checked) {
                    setLookingForMaterials(lookingForMaterials.filter((item: any) => item !== e.target.name.replace('Sökes', '')))
                  }
                  // If the checkbox is now unchecked and the category is in the lookingForMaterials array, remove it from the array
                  else if (!lookingForMaterials.includes(e.target.name.replace('Sökes', '')) && e.target.checked) {
                    setLookingForMaterials([...lookingForMaterials, e.target.name.replace('Sökes', '')])
                  }
                }}
              />
              <label htmlFor={category + "Sökes"}>{category}</label>
            </div>
          )
        })}
      </>
    )
  }

  /**
   * Creates checkboxes for all the different availableMaterials categories in the database
   */
  const createAvailableFilter = () => {
    let categories = getAllMaterialCategories()
    return (
      <>
        {categories.map((category: any) => {
          return (
            <div className="inputGroup" key={category + "Erbjuds"}>
              <input
                id={category + "Erbjuds"}
                name={category + "Erbjuds"}
                type="checkbox"
                onChange={(e) => {
                  // If the checkbox is now checked and the category is not in the availableMaterials array, add it to the array
                  if (availableMaterials.includes(e.target.name.replace('Erbjuds', '')) && !e.target.checked) {
                    setAvailableMaterials(availableMaterials.filter((item: any) => item !== e.target.name.replace('Erbjuds', '')))
                  }
                  // If the checkbox is now unchecked and the category is in the availableMaterials array, remove it from the array
                  else if (!availableMaterials.includes(e.target.name.replace('Erbjuds', '')) && e.target.checked) {
                    setAvailableMaterials([...availableMaterials, e.target.name.replace('Erbjuds', '')])
                  }
                }}
              />
              <label htmlFor={category + "Erbjuds"}>{category}</label>
            </div>
          )
        })}
      </>
    )
  }

  /**
   * Creates checkboxes for all the different organisations in the database
   */
  const createOrganisationFilter = () => {
    let mappedData = mapData.map((pin: any) => pin.mapItem.organisation)
    let filteredData = mappedData.filter((pin: any, index: any) => mappedData.indexOf(pin) === index).sort()
    return (
      <>
        {filteredData.map((pin: any) => {
          return (
            <div className="inputGroup" key={pin}>
              <input
                id={pin}
                name={pin}
                type="checkbox"
                onChange={(e) => {
                  // If the checkbox is now checked and the organisation is not in the organisation array, add it to the array
                  if (organisation.includes(e.target.name) && !e.target.checked) {
                    setOrganisation(organisation.filter((item: any) => item !== e.target.name))
                  }
                  // If the checkbox is now unchecked and the organisation is in the organisation array, remove it from the array
                  else if (!organisation.includes(e.target.name) && e.target.checked) {
                    setOrganisation([...organisation, e.target.name])
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
        <div className="sidebar">

          {/* Buttons for choosing project types to filter by */}
          <div className="filterBtn">
            {createProjectTypeFilter()}
          </div>

          {/* Range slider for year filter */}
          <div className="rSliderContainer">
            <div className="range-slider">
              <DualRangeSlider
                min={yearLimits.min}
                max={yearLimits.max}
                onChange={({ min, max }: any) => {
                  if (!(years.includes(min) && years.includes(max)) || (min === max && !(years[0] === min && years[1] === max))) {
                    setYears([min, max]), setSliderReset(false)
                  }
                }}
                reset={sliderReset}
              />
            </div>
          </div>

          {/*This is a range slider for months. It is currently not in use, but can be used in the future. */}
          <div className="rSliderContainer">
            <div className="range-slider">
              <DualRangeSlider
                min={1}
                max={12}
                onChange={({ min, max }: any) => {
                  if (!(months.includes(min) && months.includes(max)) || (min === max && !(months[0] === min && months[1] === max))) {
                    setMonths([min, max])
                  }
                }}
              />
            </div>
          </div>

          {/* Checkboxes for filtering materials and organisations */}
          <form className="form">
            <h3>Sökes</h3>
            {createLookingForFilter()}

            <h3>Erbjuds</h3>
            {createAvailableFilter()}

            <h3>Organisation</h3>
            {createOrganisationFilter()}
          </form>

          {/* Button for clearing the current filter */}
          <div className="clearFilter">
            <button
              id="clearBtn"
              onClick={() => {
                setProjectType([])
                setSliderReset(true)
                setYears([yearLimits.min, yearLimits.max])
                setLookingForMaterials([])
                setAvailableMaterials([])
                setOrganisation([])

                let checkboxes = document.querySelectorAll("input[type=checkbox]")
                checkboxes.forEach((checkbox: any) => {
                  checkbox.checked = false
                })
              }}>
              Rensa filter
            </button>
          </div>

          {/* Button for closing the sidebar */}
          <div className="sidebarClose">
            <button
              id="hideBtn"
              onClick={toggleMenu}>
              <Image src="/closeArrow.svg" alt="Closing arrow" width={20} height={20} />
            </button>
          </div>

        </div>
      )}

      {/* Button for opening the sidebar when it's closed */}
      {!isOpen && (
        <div className="hiddenSidebar">
          <div className="sidebarOpen">
            <button
              id="openBtn"
              onClick={toggleMenu}>
              <Image src="/openArrow.svg" alt="Open arrow" width={20} height={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}