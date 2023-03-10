import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../components/sidebar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Filter } from '../types'
import Image from 'next/image'
import styles from '../styles/index.module.css'

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

  // Contains the currently active filters
  const [currentFilter, setFilter] = useState({} as Filter)

  //Array of all months in swedish.
  const monthArray = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

  // Content of the search bar
  const [searchInput, setSearchInput] = useState("")

  // State for configuring the max amount of items in a category that can be selected before the label is compacted
  const [maxCategoryAmount, setMaxCategoryAmount] = useState(2)

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

  /**
   * Returns a p element with the currently active project type filters, if any
   */
  const projectTypeLabel = () => {
    if (currentFilter.projectType?.length) {
      if (currentFilter.projectType.length > maxCategoryAmount) {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>{currentFilter.projectType.length} projekttyper</p>
        )
      }
      else {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>{currentFilter.projectType.join(", ")}</p>
        )
      }
    }
  }

  /**
   * Returns a p element with the currently active year filters, if any
   */
  const yearLabel = () => {
    if (currentFilter.years?.length) {
      if (Math.min(...currentFilter.years) === yearLimits.min && Math.max(...currentFilter.years) === yearLimits.max) {
        return null;
      }
      else if (currentFilter.years[0] === currentFilter.years[1] && currentFilter.years[0] !== undefined) {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>År: {currentFilter.years[0]}</p>
        )
      }
      else {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>År: {Math.min(...currentFilter.years)} - {Math.max(...currentFilter.years)}</p>
        )
      }
    }
  }

  /**
   * Returns a p element with the currently active month filters, if any
   */
  const monthLabel = () => {
    if (currentFilter.months?.length) {
      if (Math.min(...currentFilter.months) === 1 && Math.max(...currentFilter.months) === 12) {
        return null;
      }
      else if (currentFilter.months[0] === currentFilter.months[1] && currentFilter.months[0] !== undefined) {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Månad: {monthArray[currentFilter.months[0] - 1]}</p>
        )
      }
      else {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Månader: {monthArray[Math.min(...currentFilter.months) - 1]} - {monthArray[Math.max(...currentFilter.months) - 1]}</p>
        )
      }
    }
  }
  

  /**
   * Returns a p element with the currently active filters regarding materials that are being searched for by the projects on the map, if any
   */
  const lookingForMaterialsLabel = () => {
    if (currentFilter.lookingForCategories?.length) {
      if (currentFilter.lookingForCategories.length > maxCategoryAmount) {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Sökes: {currentFilter.lookingForCategories.length} kategorier</p>
        )
      }
      else {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Sökes: {currentFilter.lookingForCategories.join(", ")}</p>
        )
      }
    }
  }

  /**
   * Returns a p element with the currently active filters regarding available materials, if any
   */
  const availableMaterialsLabel = () => {
    if (currentFilter.availableCategories?.length) {
      if (currentFilter.availableCategories.length > maxCategoryAmount) {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Erbjuds: {currentFilter.availableCategories.length} kategorier</p>
        )
      }
      else {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Erbjuds: {currentFilter.availableCategories.join(", ")}</p>
        )
      }
    }
  }

  /**
   * Returns a p element with the currently active filters regarding organisations, if any
   */
  const organisationLabel = () => {
    if (currentFilter.organisation?.length) {
      if (currentFilter.organisation.length > maxCategoryAmount) {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>{currentFilter.organisation.length} Organisationer</p>
        )
      }
      else {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Organisationer: {currentFilter.organisation.join(", ")}</p>
        )
      }
    }
  }

  return (
    <>
      <Head>
        <title>Återbrukskartan</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <Map currentFilter={currentFilter} searchInput={searchInput} />

      <Sidebar setFilter={setFilter} />

      {/* Searchbar */}
      <div className={styles.wrap}>
        <div className={styles.search}>
          <input
            type="search"
            className={styles.searchTerm}
            placeholder="Sök efter projekt..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <Image src="/search.svg" alt="Sökikon" width={30} height={30} />
          </div>
        </div>
      </div>

      {/* Labels showing currently avtive filters, if any */}
      <div className={styles.filterTextContent}>
        <div className={styles.filterTextContainer}>
          {projectTypeLabel()}
          {yearLabel()}
          {monthLabel()}
          {lookingForMaterialsLabel()}
          {availableMaterialsLabel()}
          {organisationLabel()}
        </div>
      </div>

      {/* Button leading to another page where one can add projects to the database */}
      <div className={`${styles.addNewPost} ${styles.tooltip}`}>
        <span className={styles.tooltipText}>Lägg till nytt projekt</span>
        <button className={styles.addNewPostButton} onClick={goToNewPost}>
          <Image src="./add.svg" alt='Lägg till nytt projekt' width={50} height={50} />
        </button>
      </div>
    </>
  )
}