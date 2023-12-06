import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/aside/sidebar'
import MobileSidebar from '@/components/aside/mobileNavbar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { RecycleFilter } from '@/types'
import Image from 'next/image'
import styles from '@/styles/index.module.css'
import { Tooltip } from '@nextui-org/react'
import { Badge } from '@nextui-org/react'
import { logoutFunction } from '@/components/logout'
import { getSession } from '@/session'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import ExpandButton from '@/components/buttons/expandButton'
import Footer from '@/components/footer/footer'
import Aside from '@/components/aside/aside'
import { relative } from 'path'

// Get user data from session
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
export const yearLimitsRecycle = {
  min: new Date().getFullYear(),
  max: new Date().getFullYear() + 10,
}

// Array of all months in swedish.
export const monthArray = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

/** The main page for the recycle section of the website. */
export default function HomePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

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

  /** Function for navigating to the new post page */
  const goToNewPost = () => {
    router.push("/aterbruk/newPost" + window.location.search)
    // useRouteHandler("/aterbruk/newPost")
  }

  /** Function for navigating to the edit post page */
  const goToEditPost = () => {
    router.push("/aterbruk/editPost" + window.location.search)
    // useRouteHandler("/aterbruk/editPost")
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

  /**
   * Returns a Badge component from nextui with the currently active filters regarding showing inactive projects, if any
   * 
   * If the showInactive filter is true, the label will be displayed
   */
  const showInactiveLabel = () => {
    if (currentFilter.showInactive) {
      return (
        <Badge disableOutline enableShadow size="lg" className={styles.filterText} style={{ backgroundColor: "black", color: "bone" }}>Visar inaktiva objekt</Badge>
      )
    }
  }

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
        <title>Återbrukskartan</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <Map currentFilter={currentFilter} searchInput={searchInput} currentMap="Recycle" />

      <div className={styles.totalPProjects}>
      </div>

      <Aside>
        {/* Searchbar */}
        {!isMobile ?
          <div style={{position: "relative", marginTop: "0"}}>
            <input
              type="search"
              className={styles.searchTerm}
              placeholder="Sök efter projekt..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Image src="/search.svg" alt="Sökikon" width={24} height={24} className={styles.searchIcon} />
          </div> : null}

        {!isMobile ? <Sidebar monthArray={monthArray} maxCategoryAmount={maxCategoryAmount} currentFilter={currentFilter} setFilter={setFilter} currentMap="Recycle" energiportalen={false} user={user} /> : <MobileSidebar setFilter={setFilter} currentMap="Recycle" energiportalen={false} user={user} />}
      </Aside>

      {/* Logout button */}
      {user && (
        <div className={styles.logout}>
          <Tooltip content={"Logga\xa0ut"} placement="left">
            <button className={styles.linkButton} onClick={logoutFunction}>
              <Image src="./images/adminIcons/logout.svg" alt='Logga ut' width={50} height={50} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Login button */}
      {!user && (
        <div className={styles.logout}>
          <Tooltip content={"Logga\xa0in"} placement="left">
            <button className={styles.linkButton} onClick={() => router.push('/login' + window.location.search)}>
              <Image src="./images/adminIcons/login.svg" alt='Logga in' width={50} height={50} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Buttons leading to other pages where one can add/edit projects to the database */}
      {(user?.isAdmin || user?.isRecycler) && (
        <>
          <div className={styles.editPost}>
            <Tooltip content={"Redigera\xa0inlägg"} placement="left">
              <button className={styles.linkButton} onClick={goToEditPost}>
                <Image src="./images/adminIcons/edit.svg" alt='Redigera projekt' width={50} height={50} />
              </button>
            </Tooltip>
          </div>

          <div className={styles.addNewPost}>
            <Tooltip content={"Lägg\xa0till\xa0nytt\xa0inlägg"} placement="left">
              <button className={styles.linkButton} onClick={goToNewPost}>
                <Image src="./images/adminIcons/addToMap.svg" alt='Lägg till nytt projekt' width={50} height={50} />
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
                <Image src="./images/adminIcons/editUser.svg" alt='Redigera användare' width={50} height={50} />
              </button>
            </Tooltip>
          </div>

          <div className={styles.addUser}>
            <Tooltip content={"Lägg\xa0till\xa0ny\xa0användare"} placement="left">
              <button className={styles.linkButton} onClick={() => router.push('admin/addUser' + window.location.search)}>
                <Image src="./images/adminIcons/addUser.svg" alt='Lägg till ny användare' width={50} height={50} />
              </button>
            </Tooltip>
          </div>
        </>
      )}

      <ExpandButton>
        <Footer />
      </ExpandButton>

    </>
  )
}