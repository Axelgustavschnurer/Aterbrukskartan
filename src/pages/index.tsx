import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../components/sidebar'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Filter } from '../types'
import Image from 'next/image'

// This is the main page of the application

export default function HomePage() {
  const router = useRouter()
  // Declares the filter variable and its setter function 
  const [currentFilter, setFilter] = useState({} as Filter)

  // Dynamically imports the map component
  const Map = React.useMemo(() => dynamic(
    () => import('../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  // Declares function for navigating to the new post page
  const goToNewPost = () => {
    router.push('/newPost')
  }

  // Declares function for removing the current filter
  const removeCurrentFilter = () => {
    setFilter({} as Filter)
  }

  useEffect(() => {
    console.log(currentFilter)
  }, [currentFilter])

  // Returns all content of the main page.
  return (
    <>
      <Head>
        <title>Återbrukskartan</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>
      <Map currentFilter={currentFilter} />
      <Sidebar setFilter={setFilter} />
      <div className="wrap">
        <div className="search">
          <input type="text" className="searchTerm" placeholder="Sök efter projekt..."></input>
          <div className='searchIcon'>
            <Image src="/search.svg" alt="Sökikon" width={30} height={30} />
          </div>
        </div>
      </div>
      <div className='filterTextContent'>
        <div className="filterTextContainer">
          {/*
            currentFilter.projectType[0] === "Rivning" && currentFilter.projectType?.length === 1 ? <p className="filterText" style={{ backgroundColor: "#ff0000ee" }} onClick={removeCurrentFilter}>Rivning</p> :
              currentFilter.projectType[0] === "Nybyggnation" && currentFilter.projectType?.length === 1 ? <p className="filterText" style={{ backgroundColor: "#00a2ff" }} onClick={removeCurrentFilter}>Nybyggnation</p> :
                currentFilter.projectType[0] === "Ombyggnation" && currentFilter.projectType?.length === 1 ? <p className="filterText" style={{ backgroundColor: "green" }} onClick={removeCurrentFilter}>Ombyggnation</p> :
                  null
          */}
          {/* {currentFilter === "none" ? null : <p className="filterText" onClick={removeCurrentFilter}>{currentFilter}</p>} */}
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