import React, { useEffect, useState } from "react";
import { oldDataFormat } from "@/pages/api/createOldJSON";
import { createOldCsv, downloadCsv, createGenericCsv, createMapItemCsv } from "@/functions/createCsv";
import styles from "@/styles/downloads.module.css";
import Head from "next/head";
import { DeepRecycle, DeepStory } from "@/types";
import { Button } from "@nextui-org/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "@/session";

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

export default function DownloadCSV({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Data from the database
  // The data is stored in a different format for the old CSV to keep the same format as the one available on the dataportal.
  const [oldStories, setOldStories] = useState({} as { results: oldDataFormat[] })
  const [storyData, setStoryData] = useState([] as DeepStory[])
  const [recycleData, setRecycleData] = useState([] as DeepRecycle[])

  /** Fetches data from the database */
  const fetchOldData = async () => {
    const res = await fetch('/api/createOldJSON')
    const data = await res.json()
    setOldStories(data)
  }

  /** Fetches data from the database */
  const fetchStoryData = async () => {
    const res = await fetch('/api/stories')
    const data = await res.json()
    setStoryData(data)
  }

  /** Fetches data from the database */
  const fetchRecycleData = async () => {
    const res = await fetch('/api/recycle')
    const data = await res.json()
    setRecycleData(data)
  }

  // Runs the fetch functions when the page is loaded
  useEffect(() => {
    fetchOldData()
    fetchStoryData()
    fetchRecycleData()
  }, [])

  /** Handles the download of the old CSV */
  const handleOldDownload = () => {
    oldStories?.results?.length ? downloadCsv(createOldCsv(oldStories.results), "open_data.csv") : null;
  }

  /** Downloads the story table as a CSV */
  const handleStoryDownload = () => {
    storyData?.length ? downloadCsv(createGenericCsv(storyData), "story.csv") : null;
  }

  /**
   * Downloads the map_item table as a CSV
   * If the user is logged in, the map_item data related to the recycle table will be included,
   * otherwise only the map_item data related to the story table will be included.
   */
  const handleMapItemDownload = () => {
    !!user ? downloadCsv(createMapItemCsv([...storyData, ...recycleData]), "map_item.csv") : storyData?.length ? downloadCsv(createMapItemCsv(storyData), "map_item.csv") : null;
  }

  /** Downloads the recycle table as a CSV */
  const handleRecycleDownload = () => {
    recycleData?.length ? downloadCsv(createGenericCsv(recycleData), "recycle.csv") : null;
  }

  /** Imports recycle data from external source */
  const importLocalData = async () => {
    const res = await fetch('/api/addRecycleFromExternal')
    const data = await res.json()
    console.log(data)
  }

  return (
    <>
      <Head>
        <title>Ladda ner</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <Button onPress={handleOldDownload} color={"gradient"}>Ladda ner gammal stil av CSV för uppladdning till dataportal</Button>
        </div>
        <div className={styles.content}>
          <Button onPress={handleStoryDownload} color={"gradient"}>Ladda ner Stories-data</Button>
        </div>
        <div className={styles.content}>
          <Button onPress={handleMapItemDownload} color={"gradient"}>Ladda ner mapItem-data (platser, organisationer och år kopplat till annan data)</Button>
        </div>
        { // If the user has access to the recycle data, the button to download it will be shown
          !!user ?
            <>
              <div className={styles.content}>
                <Button onPress={handleRecycleDownload} color={"gradient"}>Ladda ner Recycle-data</Button>
              </div>
              { // If the user is an admin, show button to import recycle data from external source
                // Note that it only works on localhost
                user.isAdmin ?
                  <div className={styles.content}>
                    <Button onPress={importLocalData} color={"gradient"}>Importera Recycle-data från csv [Enbart på localhost]</Button>
                  </div>
                  : null
              }
            </>
            : null
        }
      </div >
    </>
  );
}