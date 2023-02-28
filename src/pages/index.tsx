import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from './sidebar'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'


export default function HomePage() {
  const router = useRouter()
  const [currentFilter, setFilter] = useState("none")

  const Map = React.useMemo(() => dynamic(
    () => import('../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  const goToNewPost = () => {
    router.push('/newPost')
  }

  const removeCurrentFilter = () => {
    setFilter("none")
  }

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
            <img src="/search.svg" alt="searchicon" style={{ width: "30px", height: "30px" }} />
          </div>
        </div>
      </div>
      <div className='filterTextContent'>
        <div className="filterTextContainer">
          {
            currentFilter === "Rivning" ? <p className="filterText" style={{ backgroundColor: "#ff0000ee" }} onClick={removeCurrentFilter}>Rivning</p> :
              currentFilter === "Nybyggnation" ? <p className="filterText" style={{ backgroundColor: "#00a2ff" }} onClick={removeCurrentFilter}>Nybyggnation</p> :
                currentFilter === "Ombyggnation" ? <p className="filterText" style={{ backgroundColor: "green" }} onClick={removeCurrentFilter}>Ombyggnation</p> :
                  null
          }
          {/* {currentFilter === "none" ? null : <p className="filterText" onClick={removeCurrentFilter}>{currentFilter}</p>} */}
        </div>
      </div>
      <div className="addNewPost">
        <button className="addNewPostButton" onClick={goToNewPost}>
          <img src="./add.svg" />
        </button>
      </div>

    </>

  )
}