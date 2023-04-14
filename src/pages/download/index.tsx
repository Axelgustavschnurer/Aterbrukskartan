import React, { useEffect, useState } from "react";
import { oldDataFormat } from "@/pages/api/createOldJSON";
import { createOldCsv, downloadCsv, createGenericCsv, createMapItemCsv } from "@/functions/createCsv";
import styles from "@/styles/downloads.module.css";
import Image from "next/image";
import { DeepRecycle, DeepStory } from "@/types";
import { useRouter } from "next/router";
import { websiteKeys } from "@/keys";
import { Button } from "@nextui-org/react";

export default function DownloadCSV() {
  const router = useRouter()
  // Data from the database
  // The data is stored in a different format for the old CSV to keep the same format as the one available on the dataportal.
  const [oldStories, setOldStories] = useState({} as { results: oldDataFormat[] })
  const [storyData, setStoryData] = useState([] as DeepStory[])
  const [recycleData, setRecycleData] = useState([] as DeepRecycle[])

  // Whether or not the user has access to the recycle data
  const [recycleAccess, setRecycleAccess] = useState(false)

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

  // Checks the URL for queries and sets access accordingly
  // If the query is correct, the user has access to the recycle data and the mapItem data will include things related to the recycle projects.
  useEffect(() => {
    // The query is the part of the url after the question mark. It is case sensitive.
    // For example, if the url is "www.example.com?test=abc", the query is "test=abc", with the key being "test" and the value being "abc".
    // In order to have multiple queries, they are separated by an ampersand (&).
    // For example, "www.example.com?test=abc&thing=4" has two queries, "test=abc" and "thing=4".
    let query = router.query

    query["demoKey"] === websiteKeys["demoKey"] ? setRecycleAccess(true) : setRecycleAccess(false)
  }, [router.query])

  /** Handles the download of the old CSV */
  const handleOldDownload = () => {
    oldStories?.results?.length ? downloadCsv(createOldCsv(oldStories.results), "open_data.csv") : null;
  }

  /** Downloads the story table as a CSV */
  const handleStoryDownload = () => {
    storyData?.length ? downloadCsv(createGenericCsv(storyData), "story.csv") : null;
  }

  /** Downloads the map_item table as a CSV */
  const handleMapItemDownload = () => {
    recycleAccess ? downloadCsv(createMapItemCsv([...storyData, ...recycleData]), "map_item.csv") : storyData?.length ? downloadCsv(createMapItemCsv(storyData), "map_item.csv") : null;
  }

  /** Downloads the recycle table as a CSV */
  const handleRecycleDownload = () => {
    recycleData?.length ? downloadCsv(createGenericCsv(recycleData), "recycle.csv") : null;
  }

  return (
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
      {
        recycleAccess ?
          <>
            <div className={styles.content}>
              <Button onPress={handleRecycleDownload} color={"gradient"}>Ladda ner Recycle-data</Button>
            </div>
          </>
          : null
      }
    </div >
  );
}