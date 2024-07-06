import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/aside/sidebar'
import MobileSidebar from '@/components/aside/mobileNavbar'
import { logoutFunction } from '@/components/logout'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { RecycleFilter } from '@/types'
import Image from 'next/image'
import { getSession } from '@/session'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'

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

  const [isMobile, setIsMobile] = useState(false as boolean)

  const [isNavClosed, setIsNavClosed] = useState(false)

  // Contains the currently active filters
  const [currentFilter, setFilter] = useState({} as RecycleFilter)

  // Content of the search bar
  const [searchInput, setSearchInput] = useState("")

  // State for configuring the max amount of items in a category that can be selected before the label is compacted
  const maxCategoryAmount = React.useMemo(() => 2, [])

  // Dynamically imports the map component
  // TODO: This will look a little laggy as the map component will render a loading spinner when fetching data aswell
  // TODO: See if you can maybe pass in the isLoading state as a prop here maybe?
  const Map = React.useMemo(() => dynamic(
    () => import('../../components/map'),
    {
      loading: () =>
        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', position: 'absolute', top: '0', left: '0', backgroundColor: 'rgba(255, 255, 255, .75)', borderRadius: '.5rem', zIndex: 99 }}>
          <Image src="/loading.svg" alt="Laddar data" width={128} height={128}></Image>
        </div>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])


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

  // Check session storage for the nav state
  useEffect(() => {
    if (sessionStorage?.getItem('navClosed') == 'true') {
      setIsNavClosed(true)
    }
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
        <link rel="icon" type="image/x-icon" href="/favicon.svg" />
      </Head>

      <main
        className='grid gap-50'
        style={{
          backgroundColor: '#f5f5f5',
          gridTemplateRows: 'calc(100dvh - 1rem)',
          gridTemplateColumns: isMobile ? 'auto' : 'auto auto 1fr',
          padding: isMobile ? '0' : '.5rem'
        }}>

        {!isMobile ?
          <>
            <aside className='padding-50 flex' style={{ backgroundColor: 'white', borderRadius: '.5rem', flexDirection: 'column', overflow: 'hidden' }}>

              <section>
                <div className='padding-50' style={{ position: 'relative', width: 'fit-content' }}>
                  <input type="checkbox" id='toggle-nav' style={{ position: 'absolute', left: '0', top: '0', height: '100%', width: '100%', zIndex: '2', opacity: '0' }} checked={isNavClosed}
                    onChange={() => {
                      // If the nav is currently open, remove the item from session storage, otherwise add it
                      if (isNavClosed) {
                        sessionStorage?.removeItem('navClosed')
                      } else {
                        sessionStorage?.setItem('navClosed', 'true')
                      };
                      setIsNavClosed(!isNavClosed);
                    }}
                  />
                  <Image src='/hamburger.svg' alt='Växla navigering' width={24} height={24} style={{ display: 'grid' }} />
                </div>

                {/* Login button  */}
                {!user && (
                  <Link href="/login" className='flex align-items-center gap-100 padding-50 navbar-link'>
                    Logga in
                    <Image src="/images/adminIcons/login.svg" alt='Logga in' width={24} height={24} />
                  </Link>
                )}
              </section>

              <section className='flex-grow-100 padding-block-100'>
                {/* Buttons leading to other pages where one can add/edit projects to the database */}
                {(user?.isAdmin || user?.isRecycler) && (
                  <>
                    <Link href='/aterbruk/newPost' className='flex align-items-center gap-100 padding-50 navbar-link'>
                      <Image src="/images/adminIcons/addToMap.svg" alt='Lägg till nytt projekt' width={24} height={24} />
                      Skapa nytt inlägg
                    </Link>

                    <Link href='/aterbruk/editPost' className='flex align-items-center gap-100 padding-50 navbar-link'>
                      <Image src="/images/adminIcons/edit.svg" alt='Redigera projekt' width={24} height={24} />
                      Redigera inlägg
                    </Link>
                  </>
                )}

                {/* Buttons leading to the admin pages */}
                {user?.isAdmin && (
                  <>
                    <Link href='/admin/addUser' className='flex align-items-center gap-100 padding-50 navbar-link'>
                      <Image src="/images/adminIcons/addUser.svg" alt='Lägg till ny användare' width={24} height={24} />
                      Skapa ny användare
                    </Link>

                    <Link href='/admin/editUser' className='flex align-items-center gap-100 padding-50 navbar-link'>
                      <Image src="/images/adminIcons/editUser.svg" alt='Redigera användare' width={24} height={24} />
                      Redigera användare
                    </Link>
                  </>
                )}
              </section>

              <section>
                <Link href='https://github.com/STUNS-Uppsala/Aterbrukskartan' target='_blank' className='flex align-items-center gap-100 padding-50 navbar-link'>
                  <Image src="/github-mark.svg" alt='GitHub logo' width={24} height={24} />
                  Se koden på GitHub
                </Link>

                {/* Logout button */}
                {user && (
                  <button type="button" onClick={logoutFunction} className='flex align-items-center padding-50 gap-100' style={{ width: '100%', fontSize: '1rem', fontWeight: '500', backgroundColor: 'transparent' }}>
                    <Image src="/images/adminIcons/logout.svg" alt='Logga ut' width={24} height={24} />
                    Logga ut
                  </button>
                )}
              </section>
            </aside>

            <aside className='padding--block-50' style={{ backgroundColor: 'white', borderRadius: '.5rem', paddingTop: '0' }}>
              <label className='block padding-50'>
                <div className='flex gap-100 flex-wrap-wrap justify-content-space-between align-items-center padding-block-50'>
                  <h1 style={{ fontSize: '1.25rem', margin: '0' }}>Sök bland projekt</h1>
                  <Image src='/question.svg' alt='hjälp' width={24} height={24} style={{ cursor: 'help' }} />
                </div>
                <input
                  type="search"
                  className='margin-block-25 padding-50'
                  placeholder="Ex. projekttyp, startår, material etc..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </label>

              <div className='padding-right-50 padding-block-50' style={{ height: 'calc(100% - 100px)' }}>
                <div className='padding-inline-50' style={{ borderRadius: '.5rem', maxHeight: '100%', overflowY: 'scroll' }}>
                  <Sidebar
                    monthArray={monthArray}
                    maxCategoryAmount={maxCategoryAmount}
                    currentFilter={currentFilter}
                    setFilter={setFilter}
                    currentMap="Recycle"
                    user={user}
                  />
                </div>
              </div>
            </aside>
          </>
        : <MobileSidebar
            setFilter={setFilter}
            currentMap="Recycle"
            user={user}
          />
        }

        <div style={{ position: 'relative' }}>
          <Map currentFilter={currentFilter} searchInput={searchInput} currentMap="Recycle" />
        </div>

      </main>
    </>
  )
}