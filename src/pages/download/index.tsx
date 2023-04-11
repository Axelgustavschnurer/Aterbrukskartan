import React, { useEffect, useState } from "react";
import { oldDataFormat } from "@/pages/api/createOldJSON";
import { createCsv, downloadCsv } from "@/functions/createOldCsv";
import styles from "@/styles/downloads.module.css";
import Image from "next/image";

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
        <Image src="/images/download-button.webp" alt="test" width={1000} height={100} />
      </div>
    </div>
  );
}