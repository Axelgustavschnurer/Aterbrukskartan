import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "./dualSlider";
import { Filter } from "@/types";
import Image from "next/image";

// Sidebar component for filtering the map

export default function Sidebar({ setFilter }: any) {
  // Gets current year to set as default value for slider
  const currentDate = new Date().getFullYear()

  // Handles the state of the sidebar's visibility
  const [isOpen, setOpen] = useState(true);
  const [newData, setNewData] = useState([])

  // List of all active filters for the field `lookingForMaterials`
  const [lookingForMaterials, setLookingForMaterials] = useState([] as string[])

  // List of all active filters for the field `availableMaterials`
  const [availableMaterials, setAvailableMaterials] = useState([] as string[])

  // List of all active filters for the field `organisation`
  const [organisation, setOrganisation] = useState([] as string[])

  const [years, setYears] = useState([] as number[])
  const [months, setMonths] = useState([] as number[])
  const [projectType, setProjectType] = useState([] as string[])

  // Updates filter state when the user interacts with any of the filter components
  useEffect(() => {
    setFilter({
      projectType: projectType,
      years: years,
      lookingForCategories: lookingForMaterials,
      availableCategories: availableMaterials,
      organisation: organisation,
    } as Filter)
    console.log("Filter", projectType, years, lookingForMaterials, availableMaterials, organisation)
  }, [projectType, years, lookingForMaterials, availableMaterials, organisation, setFilter])

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

  /**
   * Fetches data from the database
   */
  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/getData')
    const data = await response.json()
    setNewData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  /**
   * Updates the state of the projectType array to include or exclude the id of the button that was clicked, depending on if it was already included or not.
   * @param e Event object
   */
  const updateProjectType = (e: any) => {
    if (projectType.includes(e.currentTarget.id)) {
      setProjectType(projectType.filter((item: any) => item !== e.currentTarget.id))
    } else {
      setProjectType([...projectType, e.currentTarget.id])
    }
  }

  /**
   * Returns an array of all the different material categories in the database
   * @returns string[]
   */
  const getAllMaterialCategories = () => {
    // List of all strings in the availableMaterials and lookingForMaterials fields
    let unsplitMaterials: string[] = []
    newData.map((pin: any) => {
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
   * @returns JSX.Element
   */
  const getLookingFor = () => {
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
                  if (lookingForMaterials.includes(e.target.name.replace('Sökes', '')) && !e.target.checked) {
                    setLookingForMaterials(lookingForMaterials.filter((item: any) => item !== e.target.name.replace('Sökes', '')))
                  }
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
   * @returns JSX.Element
   */
  const getAvailable = () => {
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
                  if (availableMaterials.includes(e.target.name.replace('Erbjuds', '')) && !e.target.checked) {
                    setAvailableMaterials(availableMaterials.filter((item: any) => item !== e.target.name.replace('Erbjuds', '')))
                  }
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
   * @returns JSX.Element
   */
  const getOrganisation = () => {
    let mappedData = newData.map((pin: any) => pin.mapItem.organisation)
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
                  if (organisation.includes(e.target.name) && !e.target.checked) {
                    setOrganisation(organisation.filter((item: any) => item !== e.target.name))
                  }
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

  // Returns the sidebar component. It cannot be interacted with if it is closed, other than opening it. 
  // It contains the type project buttons and the slider for filtering the map, as well as a form for filtering parts and organizastions, on top of a button to clear the current filter. 
  // Lastly, it contains a button for closing the sidebar. 

  return (
    <>
      {isOpen && (
        <div className="sidebar">
          <div className="filterBtn">
            <div className="alignBtn">
              <button
                id="Rivning"
                onClick={updateProjectType}
              >
                <Image src="/images/riv.svg" alt="Rivning" width={40} height={40} />
              </button>
              <p>Rivning</p>
            </div>
            <div className="alignBtn">
              <button
                id="Nybyggnation"
                onClick={updateProjectType}
              >
                <Image src="/images/bygg.svg" alt="Nybyggnation" width={40} height={40} />
              </button>
              <p>Nybyggnation</p>
            </div>
            <div className="alignBtn">
              <button
                id="Ombyggnation"
                onClick={updateProjectType}
              >
                <Image src="/images/ater.svg" alt="Ombyggnation" width={40} height={40} />
              </button>
              <p>Ombyggnation</p>
            </div>
          </div>
          <div className="rSliderContainer">
            <div className="range-slider">
              <DualRangeSlider
                // If the default values for min and max are changed in the future, for example changing max to {currentDate + 25}, they must be changed at ../functions/filterData.tsx as well.
                // They can be found in the function `runActiveFilters`
                min={currentDate}
                max={currentDate + 10}
                onChange={({ min, max }: any) => {
                  if (!(years.includes(min) && years.includes(max)) || (min === max && !(years[0] === min && years[1] === max))) {
                    setYears([min, max])
                  }
                  console.log(`min = ${min}, max = ${max}`)
                  console.log(years)
                }}
              />
            </div>
          </div>
          {/*This is a range slider for months. It is currently not in use, but can be used in the future. */
          <div className="rSliderContainer">
            <div className="range-slider">
              <DualRangeSlider
                // If the default values for min and max are changed in the future, they must be changed at ../functions/filterData.tsx as well.
                // They can be found in the function `runActiveFilters`
                min={1}
                max={12}
                onChange={({ min, max }: any) => {
                  if (!(months.includes(min) && months.includes(max))) {
                    setMonths([min, max])
                  }
                  console.log(`min month = ${min}, max = ${max}`)
                }}
              />
            </div>
          </div> }

          <form className="form">
            <h3>Sökes</h3>
            {getLookingFor()}

            <h3>Erbjuds</h3>
            {getAvailable()}

            <h3>Organisation</h3>
            {getOrganisation()}

          </form>
          <div className="clearFilter">
            <button
              id="clearBtn"
              onClick={() => {
                setProjectType([])
                setYears([currentDate, currentDate + 10])
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
          <div className="sidebarClose">
            <button
              id="hideBtn"
              onClick={toggleMenu}>
              <Image src="/closeArrow.svg" alt="Closing arrow" width={20} height={20} />
            </button>
          </div>
        </div>
      )
      }
      {
        !isOpen && (
          <div className="hiddenSidebar">
            <div className="sidebarOpen">
              <button
                id="openBtn"
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