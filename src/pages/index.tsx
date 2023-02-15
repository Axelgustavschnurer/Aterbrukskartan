import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../components/sidebar'


export default function HomePage() {
  const Map = React.useMemo(() => dynamic(
    () => import('../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])
  return (
    <>
      <Map />
      <div className="wrap">
        <div className="search">
          <input type="text" className="searchTerm" placeholder="What are you looking for?"></input>
        </div>
      </div>
      <Sidebar />


    </>

  )
}


