import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../components/sidebar'
import { useRouter } from 'next/router'


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
  return (
    <>
      <Map />
      <div className="wrap">
        <div className="search">
          <input type="text" className="searchTerm" placeholder="Sök efter projekt..."></input>
        </div>
      </div>
      <Sidebar />
      <div className="addNewPost">
        <button className="addNewPostButton" onClick={goToNewPost}>
          <img src="./add.svg" />
        </button>
      </div>

    </>

  )
}


