import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../components/sidebar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Filter } from '../types'
import Image from 'next/image'

/**
 * The minimum and maximum year that can be selected in the year slider in ../components/sidebar.tsx
 * These values are also used at other points to check if the sliders are at their default values
 */
export const yearLimits = {
  min: new Date().getFullYear(),
  max: new Date().getFullYear() + 10,
}

export default function HomePage() {
  const router = useRouter()
  // Declares the filter variable and its setter function
  // Some defaults are set here in order to avoid unwanted behaviour when the filter is first loaded
  const [currentFilter, setFilter] = useState({
    years: [yearLimits.min, yearLimits.max],
    organisation: [],
  } as Filter)
  const [searchInput, setSearchInput] = useState("")

  // Dynamically imports the map component
  const Map = React.useMemo(() => dynamic(
    () => import('../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  // Function for navigating to the new post page
  const goToNewPost = () => {
    router.push('/newPost')
  }

  const [maxCategoryAmount, setMaxCategoryAmount] = useState(2)

  /**
   * Returns an array of strings with the currently active project type filters
   */
  const projectTypeLabels = () => {
    let projectTypeLabel: string[] | undefined = []
    for (let i = 0; i < 3; i++){
      if (currentFilter.projectType){
        if(currentFilter.projectType[i] === "Rivning" || currentFilter.projectType[i] === "Nybyggnation" || currentFilter.projectType[i] === "Ombyggnation"){
          projectTypeLabel?.push(currentFilter.projectType[i] + "sprojekt")
        }
      }
    }
    return projectTypeLabel
  }

  /**
   * Returns an array of strings with the currently active year filters
   */
  const yearLabels = () => {
    let yearLabel: string[] = []
    const getYears = currentFilter.years!.map((year: number) => {
      return year;
    })
    if (getYears){
      if(getYears[0] === getYears[1] && getYears[0] !== undefined){
        yearLabel!.push(getYears[0].toString())
      } else if (Math.min(...getYears) === yearLimits.min && Math.max(...getYears) === yearLimits.max){
        null;
      } else {
        yearLabel!.push(Math.min(...getYears) + " - " + Math.max(...getYears))
      }
    }
    return yearLabel
  }

  /**
   * Returns an array of strings with the currently active filters regarding available materials
   */
  const availableMaterialsLabels = () => {
    let availableMaterialsLabel: string[] | undefined = []
    for (let i = 0; i < 4; i++){
      if (currentFilter.availableCategories){
        if (currentFilter.availableCategories[i] === "Stomme" || currentFilter.availableCategories[i] === "Inredning" || currentFilter.availableCategories[i] === "Småsaker" || currentFilter.availableCategories[i] === "Övrigt"){
          availableMaterialsLabel?.push(currentFilter.availableCategories[i])
      }}
    }
    return availableMaterialsLabel
  }

  /**
   * Returns an array of strings with the currently active filters regarding materials that are being searched for by the projects on the map
   */
  const searchingMaterialsLabels = () => {
    let searchingMaterialsLabel: string[] | undefined = []
    for (let i = 0; i < 4; i++){
      if (currentFilter.lookingForCategories){
        if (currentFilter.lookingForCategories[i] === "Stomme" || currentFilter.lookingForCategories[i] === "Inredning" || currentFilter.lookingForCategories[i] === "Småsaker" || currentFilter.lookingForCategories[i] === "Övrigt"){
          searchingMaterialsLabel?.push(currentFilter.lookingForCategories[i])
      }}
    }
    return searchingMaterialsLabel
  }

  /**
   * Returns an array of strings with the currently active organisation filters
   */
  const organisationLabels = () => {
    let organisationLabel: string[] | undefined = []
    const getOrganisations = currentFilter.organisation!.map((organisation: string) => {
      return organisation;
    })
    for (let i = 0; i < getOrganisations.length; i++){
      if (currentFilter.organisation){
        organisationLabel?.push(currentFilter.organisation[i])
      }
    }
    return organisationLabel
  }


  // Returns all content of the main page.
  return (
    <>
      <Head>
        <title>Återbrukskartan</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>
      <Map currentFilter={currentFilter} searchInput={searchInput} />
      <Sidebar setFilter={setFilter} />
      <div className="wrap">
        <div className="search">
          <input
            type="search"
            className="searchTerm"
            placeholder="Sök efter projekt..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className='searchIcon'>
            <Image src="/search.svg" alt="Sökikon" width={30} height={30} />
          </div>
        </div>
      </div>
      <div className='filterTextContent'>
        <div className="filterTextContainer">
          {projectTypeLabels().length && projectTypeLabels()!.length < 3 ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>{projectTypeLabels().join(", ")}</p>
            :projectTypeLabels().length && projectTypeLabels().length === 3 ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>Alla projektstyper</p>
              :null
          }
          {yearLabels().length ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>År: {yearLabels()}</p>
            :null
          }
          {searchingMaterialsLabels().length && searchingMaterialsLabels()!.length <= maxCategoryAmount ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>Sökes: {searchingMaterialsLabels().join(", ")}</p>
            :searchingMaterialsLabels().length && searchingMaterialsLabels().length > maxCategoryAmount ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>Sökes: {searchingMaterialsLabels().length} kategorier</p>
              :null
          }
          {availableMaterialsLabels().length && availableMaterialsLabels()!.length <= maxCategoryAmount ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>Erbjuds: {availableMaterialsLabels().join(", ")}</p>
            :availableMaterialsLabels().length && availableMaterialsLabels().length > maxCategoryAmount ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>Erbjuds: {availableMaterialsLabels().length} kategorier</p>
              :null
          }
          {organisationLabels().length && organisationLabels()!.length <= maxCategoryAmount ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>Organisationer: {organisationLabels().join(", ")}</p>
            :organisationLabels().length && organisationLabels().length > maxCategoryAmount ? <p className="filterText" style={{ backgroundColor: "#fd9800" }}>{organisationLabels().length} Organisationer</p>
              :null
          }
        </div>
      </div>
      <div className="addNewPost tooltip">
        <span className="tooltipText">Lägg till nytt projekt</span>
        <button className="addNewPostButton" onClick={goToNewPost}>
          <Image src="./add.svg" alt='Lägg till nytt projekt' width={50} height={50} />
        </button>
      </div>
    </>
  )
}