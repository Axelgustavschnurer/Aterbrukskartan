import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/sidebar'
import MobileSidebar from '@/components/mobileNavbar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { StoryFilter } from '@/types'
import Image from 'next/image'
import styles from '@/styles/index.module.css'
import Footer from '@/components/footer'
import { Tooltip, Badge } from '@nextui-org/react'
import { logoutFunction } from '@/components/logout'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getSession } from '@/session'
import Link from 'next/link'

// Gets user data from the session
export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const { user } = await getSession(req, res)

  if (!user) {
    return {
      props: {
        user: null
      }
    }
  }

  return {
    props: {
      user: user
    }
  }
}

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
export default function HomePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  // Controls whether the content should be tailored to "energiportalen" or not
  const [energiportalen, setEnergiportalen] = useState(false)

  // Contains the currently active filters
  const [currentFilter, setFilter] = useState({} as StoryFilter)

  // Content of the search bar
  const [searchInput, setSearchInput] = useState("")

  // State for configuring the max amount of items in a category that can be selected before the label is compacted
  const maxCategoryAmount = React.useMemo(() => 2, [])

  // State for keeping track of the current window width
  const [isMobile, setIsMobile] = useState(false as boolean)

  // Dynamically imports the map component
  const Map = React.useMemo(() => dynamic(
    () => import('../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  // Function for navigating to the new post page
  const goToNewStory = () => {
    router.push('/stories/newStory' + window.location.search)
  }

  const goToEditStory = () => {
    router.push('/stories/editStory' + window.location.search)
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

  // Checks the URL for queries and sets energiportalen state if the query is present
  useEffect(() => {
    let query = router.query
    !!query["energiportalen"] ? setEnergiportalen(true) : setEnergiportalen(false)
  }, [router.query])

  /** Checks if the user is on a mobile device and sets the state accordingly */
  const checkMobile = (setIsMobile: any) => {
    if (window.matchMedia("(orientation: portrait)").matches || window.innerWidth < 1000) {
      return setIsMobile(true);
    }
    else {
      return setIsMobile(false);
    }
  }

  // Checks if the user is on a mobile device on first render
  useEffect(() => {
    checkMobile(setIsMobile);
  }, [])

  // Adds an event listener to check if the window is resized to a size where the interface should change
  useEffect(() => {
    window.addEventListener("resize", () => checkMobile(setIsMobile));
    return () => window.removeEventListener("resize", () => checkMobile(setIsMobile));
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
        <Tooltip content={"Till\xa0Återbruk"} placement="left">
          <Link href="/aterbruk">
            <Image src="/map.svg" alt="Kart-ikon" width={50} height={50} />
          </Link>
        </Tooltip>
      </div>

      {/* Sidebar */}
      {!isMobile ? <Sidebar setFilter={setFilter} energiportalen={energiportalen} currentMap="Stories" user={user} /> : <MobileSidebar setFilter={setFilter} energiportalen={energiportalen} currentMap="Stories" user={user} />}

      {/* Searchbar */}
      {!isMobile ?
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
        </div> : null}

      {/* Labels showing currently avtive filters, if any */}
      {!isMobile ?
        <div className={styles.filterTextContent}>
          <div className={styles.filterTextContainer}>
            {categoryLabel()}
            {yearLabel()}
            {contentLabel()}
            {educationLabel()}
            {organisationLabel()}
          </div>
        </div>
        : null}

      {/* Logout button */}
      {user && (
        <div className={styles.logout}>
          <Tooltip content={"Logga\xa0ut"} placement="left">
            <button className={styles.linkButton} onClick={logoutFunction}>
              <Image src="./logout.svg" alt='Logga ut' width={50} height={50} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Login button */}
      {!user && (
        <div className={styles.logout}>
          <Tooltip content={"Logga\xa0in"} placement="left">
            <button className={styles.linkButton} onClick={() => router.push('/login' + window.location.search)}>
              <Image src="./login.svg" alt='Logga in' width={50} height={50} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Buttons leading to other pages where one can add/edit projects to the database */}
      {(user?.isAdmin || user?.isStoryteller) && (
        <>
          <div className={styles.editPost}>
            <Tooltip content={"Redigera\xa0en\xa0story"} placement="left">
              <button className={styles.linkButton} onClick={goToEditStory}>
                <Image src="./edit.svg" alt='Redigera projekt' width={50} height={50} />
              </button>
            </Tooltip>
          </div>

          <div className={`${styles.addNewPost}`}>
            <Tooltip content={"Lägg\xa0till\xa0ny\xa0story"} placement="left">
              <button className={styles.linkButton} onClick={goToNewStory}>
                <Image src="./add.svg" alt='Lägg till ny story' width={50} height={50} />
              </button>
            </Tooltip>
          </div>
        </>
      )}

      {/* Buttons leading to the admin pages */}
      {user?.isAdmin && (
        <>
          <div className={styles.editUser}>
            <Tooltip content={"Redigera\xa0användare"} placement="left">
              <button className={styles.linkButton} onClick={() => router.push('admin/editUser' + window.location.search)}>
                <Image src="./editUser.svg" alt='Redigera användare' width={50} height={50} />
              </button>
            </Tooltip>
          </div>

          <div className={styles.addUser}>
            <Tooltip content={"Lägg\xa0till\xa0ny\xa0användare"} placement="left">
              <button className={styles.linkButton} onClick={() => router.push('admin/addUser' + window.location.search)}>
                <Image src="./addUser.svg" alt='Lägg till ny användare' width={50} height={50} />
              </button>
            </Tooltip>
          </div>
        </>
      )}

      <Footer />
    </>
  )
}