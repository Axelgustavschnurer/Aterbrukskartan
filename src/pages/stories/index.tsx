import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/sidebar'
import MobileSidebar from '@/components/mobileSidebar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { StoryFilter } from '@/types'
import Image from 'next/image'
import styles from '@/styles/index.module.css'
import Footer from '@/components/footer'
import { Tooltip, Badge } from '@nextui-org/react'

/**
 * The minimum and maximum year that can be selected in the year slider in ../components/sidebar.tsx
 * These values are also used at other points to check if the sliders are at their default values
 */
export const yearLimitsStories = {
  min: 2014,
  max: new Date().getFullYear(),
}

/**
 * The main page for the stories section of the website.
 */
export default function HomePage() {
  const router = useRouter()

  const [admin, setAdmin] = useState(false)

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

  const goToEditStory = () => {
    router.push('/stories/editStory')
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
   * Returns a Badge component from nextui with the currently active year filters, if any
   * 
   * If the year slider is at its default values, the label will not be displayed
   * 
   * If the year slider is at a single value, the label will only display that value
   */
  const yearLabel = () => {
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

  /**
   * Returns a Badge component from nextui with the currently active filters regarding project contents, if any
   * 
   * If the amount of selected project contents is greater than maxCategoryAmount, the label will be compacted
   * to only display the amount of selected project contents
   */
  const contentLabel = () => {
    if (currentFilter.report || currentFilter.video || currentFilter.cases || currentFilter.openData || currentFilter.energyStory || currentFilter.solarData) {
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
   * Returns a Badge component from nextui with the currently active filters regarding organisations, if any
   * 
   * If the amount of selected organisations is greater than maxCategoryAmount, the label will be compacted
   * to only display the amount of selected organisations
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

  // Checks url for admin and sets admin state accordingly
  useEffect(() => {
    window.location.toString().includes("admin") ? setAdmin(true) : setAdmin(false)
  }, [])

  return (
    <>
      <Head>
        <title>Stuns Stories</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <Map currentFilter={currentFilter} searchInput={searchInput} currentMap="Stories" />

      <div className={styles.smallRightContainerOpacityStory} />
      <div className={styles.smallRightContainerStory}>
        <Tooltip content={"Till\xa0Stuns"} placement="left">
          <a href="https://stuns.se/" target="_blank" rel="noreferrer" className={styles.stunsIcon}>
            <Image src="/images/stuns.png" alt="Stunslogotyp" width={50} height={50} />
          </a>
        </Tooltip>
      </div>

      <Sidebar setFilter={setFilter} currentMap="Stories" />
      <MobileSidebar setFilter={setFilter} currentMap="Stories" />

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
          {contentLabel()}
          {educationLabel()}
          {organisationLabel()}
        </div>
      </div>

      {/* Button leading to another page where one can add projects to the database */}

      {admin && (
        <>
          <div className={`${styles.addNewPost}`}>
            <Tooltip content={"Lägg\xa0till\xa0ny\xa0story"} placement="left">
              <button className={styles.addNewPostButton} onClick={goToNewStory}>
                <Image src="./add.svg" alt='Lägg till ny story' width={50} height={50} />
              </button>
            </Tooltip>
          </div>
          <div className={styles.editPost}>
            <Tooltip content={"Redigera\xa0en\xa0story"} placement="left">
              <button className={styles.editPostButton} onClick={goToEditStory}>
                <Image src="./edit.svg" alt='Redigera projekt' width={50} height={50} />
              </button>
            </Tooltip>
          </div>
        </>
      )}
      <Footer />
    </>
  )
}