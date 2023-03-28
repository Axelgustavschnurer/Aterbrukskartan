import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/sidebar'
import MobileSidebar from '@/components/mobileSidebar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { RecycleFilter } from '@/types'
import Image from 'next/image'
import styles from '@/styles/index.module.css'
import { Tooltip } from '@nextui-org/react'
import { Badge } from '@nextui-org/react'
import NotFound from '@/errors/404'

/**
 * The minimum and maximum year that can be selected in the year slider in ../components/sidebar.tsx
 * These values are also used at other points to check if the sliders are at their default values
 */
export const yearLimitsRecycle = {
  min: new Date().getFullYear(),
  max: new Date().getFullYear() + 10,
}

// Array of all months in swedish.
export const monthArray = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

/**
 * The main page for the recycle section of the website.
 */
export default function HomePage() {
  const router = useRouter()

  // State controlling whether or not to display the site.
  // If this is false, a completely blank page will be displayed.
  const [recycle, setRecycle] = useState(false)

  // State controlling whether or not the edit and add post buttons are displayed
  const [admin, setAdmin] = useState(false)

  const [isMobile, setIsMobile] = useState(false as boolean)

  // Contains the currently active filters
  const [currentFilter, setFilter] = useState({} as RecycleFilter)

  // Content of the search bar
  const [searchInput, setSearchInput] = useState("")

  // State for configuring the max amount of items in a category that can be selected before the label is compacted
  const maxCategoryAmount = React.useMemo(() => 2, [])

  // Dynamically imports the map component
  const Map = React.useMemo(() => dynamic(
    () => import('../../components/map'),
    {
      loading: () => <Badge>A map is loading</Badge>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  // Function for navigating to the new post page
  const goToNewPost = () => {
    router.push('/aterbruk/newPost')
  }

  const goToEditPost = () => {
    router.push('/aterbruk/editPost')
  }

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
          <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "navy", color: "bone" }}>{currentFilter.projectType.length} projekttyper</Badge>
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

  // Checks the URL for queries and sets access accordingly
  useEffect(() => {
    // The query is the part of the url after the question mark. It is case sensitive.
    // For example, if the url is "www.example.com?test=abc", the query is "test=abc", with the key being "test" and the value being "abc".
    // In order to have multiple queries, they are separated by an ampersand (&).
    // For example, "www.example.com?test=abc&thing=4" has two queries, "test=abc" and "thing=4".
    let query = router.query

    // A URL passing this check looks like "www.example.com?admin=yesforreal"
    query["admin"] === "yesforreal" ? setAdmin(true) : setAdmin(false)

    // A URL passing this check looks like "www.example.com?demoKey=supersecreturlmaybechangeinthefuture"
    query["demoKey"] === "supersecreturlmaybechangeinthefuture" ? setRecycle(true) : setRecycle(false)
  }, [router.query])

  const checkMobile = (setIsMobile: any) => {
    if (window.matchMedia("(orientation: portrait)").matches || window.innerWidth < 1000) {
      return setIsMobile(true);
    }
    else {
      return setIsMobile(false);
    }
  }

  useEffect(() => {
    checkMobile(setIsMobile);
  }, [])

  useEffect(() => {
    window.addEventListener("resize", () => checkMobile(setIsMobile));
    return () => window.removeEventListener("resize", () => checkMobile(setIsMobile));
  }, [])

  return (
    <>
      {
        recycle ?
          <>
            <Head>
              <title>Återbrukskartan</title>
              <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
            </Head>

            <Map currentFilter={currentFilter} searchInput={searchInput} currentMap="Recycle" />

            <div className={styles.smallRightContainerOpacity} />
            <div className={styles.smallRightContainer}>
              <Tooltip content={"Till\xa0Stuns"} placement="left">
                <a href="https://stuns.se/" target="_blank" rel="noreferrer" className={styles.stunsIcon}>
                  <Image src="/images/stuns.png" alt="Stunslogotyp" width={50} height={50} />
                </a>
              </Tooltip>
            </div>

            <div className={styles.totalPProjects}>
            </div>

            {!isMobile ? <Sidebar setFilter={setFilter} currentMap="Recycle" /> : <MobileSidebar setFilter={setFilter} currentMap="Recycle" />}

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

            {/* Badges showing currently avtive filters, if any */}
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
            {admin && (
              <>
                <div className={styles.addNewPost}>
                  <Tooltip content={"Lägg\xa0till\xa0nytt\xa0inlägg"} placement="left">
                    <button className={styles.addNewPostButton} onClick={goToNewPost}>
                      <Image src="./add.svg" alt='Lägg till nytt projekt' width={50} height={50} />
                    </button>
                  </Tooltip>
                </div>
                <div className={styles.editPost}>
                  <Tooltip content={"Redigera\xa0inlägg"} placement="left">
                    <button className={styles.editPostButton} onClick={goToEditPost}>
                      <Image src="./edit.svg" alt='Redigera projekt' width={50} height={50} />
                    </button>
                  </Tooltip>
                </div>
              </>
            )}
          </>
          :
          <>
            <Head>
              <title>404: This page could not be found</title>
            </Head>
            <NotFound />
          </>

      }

    </>
  )
}