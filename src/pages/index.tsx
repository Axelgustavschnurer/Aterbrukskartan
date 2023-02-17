import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../components/sidebar'
import { useRouter } from 'next/router'
import { useState } from 'react'


export default function HomePage() {
  const router = useRouter()

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

  const [currentFilter, setFilter] = useState("none")

  return (
    <>
      <Sidebar setFilter={setFilter}/>
      <Map currentFilter={currentFilter}/>
      <div className="wrap">
        <div className="search">
          <input type="text" className="searchTerm" placeholder="Sök efter projekt..."></input>
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