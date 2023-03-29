import React, { useEffect, useState } from "react";
import { oldDataFormat } from "@/pages/api/createOldJSON";
import { createCsv, downloadCsv } from "@/functions/createOldCsv";
import styles from "@/styles/downloads.module.css";

export default function DownloadCSV() {
  const [oldStories, setOldStories] = useState({} as { results: oldDataFormat[] })

  const fetchData = async () => {
    const res = await fetch('/api/createOldJSON')
    const data = await res.json()
    setOldStories(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDownload = () => {
    oldStories?.results?.length ? downloadCsv(createCsv(oldStories.results), "csvTest.csv") : null;
  }
  return (
    <div className={styles.container}>
      <h1>Ladda ner CSV</h1>
      <div id={styles.downloadCsv} onClick={handleDownload}>
        <img src="https://cdn.pixabay.com/photo/2016/09/16/18/20/download-button-1674764_960_720.png" alt="test" />
      </div>
    </div>
  );
}