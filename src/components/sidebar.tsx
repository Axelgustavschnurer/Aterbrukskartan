import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "./dualSlider";
import { Filter } from "@/types";

// Sidebar component for filtering the map

export default function Sidebar({ setFilter }: any) {
  // Gets current year to set as default value for slider
  const currentDate = new Date().getFullYear()

  // Handles the state of the sidebar's visibility
  const [isOpen, setOpen] = useState(true);
  const [newData, setNewData] = useState([])

  // This will become a json object
  const [lookingForMaterials, setLookingForMaterials] = useState({
    StommeSokes: false,
    InredningSokes: false,
    SmåsakerSokes: false,
    ÖvrigtSokes: false
  })
  // Contains the strings of the materials the map item is looking for
  const [lookingForStrings, setLookingForStrings] = useState([] as string[])

  // This will become a json object
  const [availableMaterials, setAvailableMaterials] = useState({
    StommeSankes: false,
    InredningSankes: false,
    SmåsakerSankes: false,
    ÖvrigtSankes: false
  })
  // Contains the strings of the materials the map item has available
  const [availableStrings, setAvailableStrings] = useState([] as string[])

  // This will become a json object
  const [organisation, setOrganisation] = useState([])
  // Contains the strings of the organisations the user is searching for
  const [organisationStrings, setOrganisationStrings] = useState([] as string[])

  const [years, setYears] = useState([] as number[])
  const [projectType, setProjectType] = useState([] as string[])

  // Updates filter state when the user interacts with any of the filter components
  useEffect(() => {
    setFilter({
      projectType: projectType,
      years: years,
      lookingForCategories: lookingForStrings,
      availableCategories: availableStrings,
      organisation: organisationStrings,
    } as Filter)
    console.log("Filter", projectType, years, lookingForStrings, availableStrings, organisationStrings)
  }, [projectType, years, lookingForStrings, availableStrings, organisationStrings, setFilter])

  // Updates list of looking for materials when the user interacts with the lookingFor filter
  useEffect(() => {
    let lookingForStuff: string[] = [];
    for (let key in lookingForMaterials) {
      if (lookingForMaterials[key as keyof (typeof lookingForMaterials)]) {
        lookingForStuff.push(key.replace('Sokes', ''));
      }
    }
    setLookingForStrings(lookingForStuff);
    console.log("Looking For Strings", lookingForStuff);
  }, [lookingForMaterials])

  // Updates list of available materials when the user interacts with the available filter
  useEffect(() => {
    let availableStuff: string[] = [];
    for (let key in availableMaterials) {
      if (availableMaterials[key as keyof (typeof availableMaterials)]) {
        availableStuff.push(key.replace('Sankes', ''));
      }
    }
    setAvailableStrings(availableStuff);
    console.log("Available Strings", availableStuff);
  }, [availableMaterials])

  // Updates list of organisations when the user interacts with the organisation filter
  useEffect(() => {
    let orgs: string[] = [];
    for (let key in organisation) {
      if (organisation[key]) {
        orgs.push(key);
      }
    }
    setOrganisationStrings(orgs);
    console.log("Organisation Strings", orgs);
  }, [organisation])

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

  // Will be used to get and display the organizations from the database
  const getOrganization = () => {
    let mappedData = newData.map((pin: any) => pin.mapItem.organisation)
    let filteredData = mappedData.filter((pin: any, index: any) => mappedData.indexOf(pin) === index)
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
                  setOrganisation({
                    ...organisation,
                    [e.target.name]: e.target.checked
                  })
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
                id="demoBtn"
                onClick={() => {
                  if (projectType.includes("Rivning")) {
                    setProjectType(projectType.filter((item: any) => item !== "Rivning"))
                  } else {
                    setProjectType([...projectType, "Rivning"])
                  }
                }}
              >
                <img src="/images/riv.svg"></img>
              </button>
              <p>Rivning</p>
            </div>
            <div className="alignBtn">
              <button
                id="buildBtn"
                onClick={() => {
                  if (projectType.includes("Nybyggnation")) {
                    setProjectType(projectType.filter((item: any) => item !== "Nybyggnation"))
                  } else {
                    setProjectType([...projectType, "Nybyggnation"])
                  }
                }}
              >
                <img src="/images/bygg.svg" ></img>
              </button>
              <p>Nybyggnation</p>
            </div>
            <div className="alignBtn">
              <button
                id="rebuildBtn"
                onClick={() => {
                  if (projectType.includes("Ombyggnation")) {
                    setProjectType(projectType.filter((item: any) => item !== "Ombyggnation"))
                  } else {
                    setProjectType([...projectType, "Ombyggnation"])
                  }
                }}
              >
                <img src="/images/ater.svg"></img>
              </button>
              <p>Ombyggnation</p>
            </div>
          </div>
          <div className="rSliderContainer">
            <div className="range-slider">
              <DualRangeSlider
                // If the default values for min and max are changed in the future, they must be changed at ../functions/filterData.tsx as well.
                // They can be found in the function `runActiveFilters`
                min={currentDate}
                max={currentDate + 10}
                onChange={({ min, max }: any) => {
                  if (!(years.includes(min) && years.includes(max))) {
                    setYears([min, max])
                  }
                  console.log(`min = ${min}, max = ${max}`)
                }}
              />
            </div>
          </div>

          <form className="form">
            <h3>Sökes</h3>
            <div className="inputGroup">
              <input
                id="StommeSokes"
                name="StommeSokes"
                type="checkbox"
                onChange={(e) => {
                  setLookingForMaterials({
                    ...lookingForMaterials,
                    [e.target.name]: e.target.checked
                  })
                }}
              />
              <label htmlFor="StommeSokes">Stomme</label>
            </div>

            <div className="inputGroup">
              <input
                id="InredningSokes"
                name="InredningSokes"
                type="checkbox"
                onChange={(e) => {
                  setLookingForMaterials({
                    ...lookingForMaterials,
                    [e.target.name]: e.target.checked
                  })
                }}
              />
              <label htmlFor="InredningSokes">Inredning</label>
            </div>

            <div className="inputGroup">
              <input
                id="SmåsakerSokes"
                name="SmåsakerSokes"
                type="checkbox"
                onChange={(e) => {
                  setLookingForMaterials({
                    ...lookingForMaterials,
                    [e.target.name]: e.target.checked
                  })
                }}
              />
              <label htmlFor="SmåsakerSokes">Småsaker</label>
            </div>

            <div className="inputGroup">
              <input
                id="ÖvrigtSokes"
                name="ÖvrigtSokes"
                type="checkbox"
                onChange={(e) => {
                  setLookingForMaterials({
                    ...lookingForMaterials,
                    [e.target.name]: e.target.checked
                  })
                }}
              />
              <label htmlFor="ÖvrigtSokes">Övrigt</label>
            </div>

            <h3>Skänkes</h3>
            <div className="inputGroup">
              <input
                id="StommeSankes"
                name="StommeSankes"
                type="checkbox"
                onChange={(e) => {
                  setAvailableMaterials({
                    ...availableMaterials,
                    [e.target.name]: e.target.checked
                  })
                }}
              />
              <label htmlFor="StommeSankes">Stomme</label>
            </div>

            <div className="inputGroup">
              <input
                id="InredningSankes"
                name="InredningSankes"
                type="checkbox"
                onChange={(e) => {
                  setAvailableMaterials({
                    ...availableMaterials,
                    [e.target.name]: e.target.checked
                  })
                }}
              />
              <label htmlFor="InredningSankes">Inredning</label>
            </div>

            <div className="inputGroup">
              <input
                id="SmåsakerSankes"
                name="SmåsakerSankes"
                type="checkbox"
                onChange={(e) => {
                  setAvailableMaterials({
                    ...availableMaterials,
                    [e.target.name]: e.target.checked
                  })
                }}
              />
              <label htmlFor="SmåsakerSankes">Småsaker</label>
            </div>

            <div className="inputGroup">
              <input
                id="ÖvrigtSankes"
                name="ÖvrigtSankes"
                type="checkbox"
                onChange={(e) => {
                  setAvailableMaterials({
                    ...availableMaterials,
                    [e.target.name]: e.target.checked
                  })
                }}
              />
              <label htmlFor="ÖvrigtSankes">Övrigt</label>
            </div>

            <h3>Organisation</h3>
            {getOrganization()}

          </form>
          <div className="clearFilter">
            <button
              id="clearBtn"
              onClick={() => {
                setProjectType([])
                setYears([currentDate, currentDate + 10])
                setLookingForMaterials({
                  StommeSokes: false,
                  InredningSokes: false,
                  SmåsakerSokes: false,
                  ÖvrigtSokes: false
                })
                setAvailableMaterials({
                  StommeSankes: false,
                  InredningSankes: false,
                  SmåsakerSankes: false,
                  ÖvrigtSankes: false
                })
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
              <img src="/closeArrow.svg" alt="Closing arrow" />
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
                <img src="/openArrow.svg" alt="Open arrow" />
              </button>
            </div>
          </div>
        )
      }
    </>
  );
}