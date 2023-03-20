import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/sidebar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { StoryFilter } from '@/types'
import Image from 'next/image'
import styles from '@/styles/index.module.css'
import Footer from '@/components/footer'
import { Tooltip } from '@nextui-org/react'

/**
 * The minimum and maximum year that can be selected in the year slider in ../components/sidebar.tsx
 * These values are also used at other points to check if the sliders are at their default values
 */
export const yearLimitsStories = {
  min: 2014,
  max: new Date().getFullYear(),
}

export default function HomePage() {
  const router = useRouter()

  // Contains the currently active filters
  const [currentFilter, setFilter] = useState({} as StoryFilter)


  // Content of the search bar
  const [searchInput, setSearchInput] = useState("")

  // State for configuring the max amount of items in a category that can be selected before the label is compacted
  const maxCategoryAmount = React.useMemo(() => 2, [])

  // Dynamically imports the map component
  const Map = React.useMemo(() => dynamic(
    () => import('../../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  // Function for navigating to the new post page
  const goToNewStory = () => {
    router.push('/stories/newStory')
  }

  /**
   * Returns a p element with the currently active category filters, if any
   */
  const categoryLabel = () => {
    if (currentFilter.categories?.length) {
      if (currentFilter.categories.length > maxCategoryAmount) {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>{currentFilter.categories.length} Kategorier</p>
        )
      }
      else {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Kategorier: {currentFilter.categories.join(", ")}</p>
        )
      }
    }
  }

  /**
   * Returns a p element with the currently active year filters, if any
   */
  const yearLabel = () => {
    if (currentFilter.years?.length) {
      if (Math.min(...currentFilter.years) === yearLimitsStories.min && Math.max(...currentFilter.years) === yearLimitsStories.max) {
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

  const educationLabel = () => {
    if (currentFilter.educationalProgram?.length) {
      if (currentFilter.educationalProgram.length > maxCategoryAmount) {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>{currentFilter.educationalProgram.length} Utbildningar</p>
        )
      }
      else {
        return (
          <p className={styles.filterText} style={{ backgroundColor: "#fd9800" }}>Utbildningar: {currentFilter.educationalProgram.join(", ")}</p>
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
        <title>Stuns Stories</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <Map currentFilter={currentFilter} searchInput={searchInput} currentMap="Stories" />

      <Sidebar setFilter={setFilter} currentMap="Stories" />

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
          {categoryLabel()}
          {yearLabel()}
          {educationLabel()}
          {organisationLabel()}
        </div>
      </div>

      {/* Button leading to another page where one can add projects to the database */}
      <div className={`${styles.addNewPost}`}>
        <Tooltip content={"Lägg\xa0till\xa0ny\xa0story"} placement="left">
          <button className={styles.addNewPostButton} onClick={goToNewStory}>
            <Image src="./add.svg" alt='Lägg till ny story' width={50} height={50} />
          </button>
        </Tooltip>
      </div>
      <Footer />
    </>
  )
}