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
  const [currentFilter, setFilter] = useState({
    years: [new Date().getFullYear(), new Date().getFullYear() + 10],
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

  // Declares function for navigating to the new post page
  const goToNewPost = () => {
    router.push('/newPost')
  }

  // Declares function for removing the current filter
  const removeCurrentFilter = () => {
    setFilter({} as Filter)
  }

  const [minYear, setMinYear] = useState(new Date().getFullYear())
  const [maxYear, setMaxYear] = useState(new Date().getFullYear() + 10)

  // Declares function for displaying the current filter
  const filterLabels = () => {
    let filterLabel: string[] | undefined = []
    const getYears = currentFilter.years!.map((year: number) => {
      return year;
    })
    for (let i = 0; i < 3; i++){
      if (currentFilter.projectType){
        if(currentFilter.projectType[i] === "Rivning" || currentFilter.projectType[i] === "Nybyggnation" || currentFilter.projectType[i] === "Ombyggnation"){
          filterLabel?.push(currentFilter.projectType[i] + "sprojekt")
        }
      }
      if (currentFilter.availableCategories){
        if (currentFilter.availableCategories[i] === "Stomme" || currentFilter.availableCategories[i] === "Inredning" || currentFilter.availableCategories[i] === "Småsaker" || currentFilter.availableCategories[i] === "Övrigt"){
          filterLabel?.push(currentFilter.availableCategories[i] + " sökes")
        }
      }
      if (currentFilter.lookingForCategories){
        if (currentFilter.lookingForCategories[i] === "Stomme" || currentFilter.lookingForCategories[i] === "Inredning" || currentFilter.lookingForCategories[i] === "Småsaker" || currentFilter.lookingForCategories[i] === "Övrigt"){
          filterLabel?.push(currentFilter.lookingForCategories[i] + " erbjuds")
        }
      }
    }
    if (getYears){
      if(getYears[0] === getYears[1] && getYears[0] !== undefined){
        filterLabel!.push(getYears[0].toString(), getYears[1].toString())
      } else if (Math.min(...getYears) === minYear && Math.max(...getYears) === maxYear){
        null;
      } else {
        filterLabel!.push(Math.min(...getYears) + " - " + Math.max(...getYears))
      }
    }
    return filterLabel
  }

  // Returns all content of the main page.
  return (
    <>
      <Head>
        <title>Återbrukskartan</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>
      <Map currentFilter={currentFilter} searchInput={searchInput} />
      <Sidebar setFilter={setFilter} minYear={minYear} maxYear={maxYear} />
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
          {
            filterLabels().length && filterLabels()!.length <= 3 ? <p className="filterText" style={{ backgroundColor: "#fd9800" }} onClick={removeCurrentFilter}>{filterLabels().join(", ")}</p> :
                  null
          }
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