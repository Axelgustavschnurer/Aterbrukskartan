import React, { useEffect, useState } from "react";
import { oldDataFormat } from "@/pages/api/createOldJSON";
import { createCsv, downloadCsv } from "@/functions/createOldCsv";

export default function Solar() {
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
    <div>
      <h1>Solar</h1>
      <button onClick={handleDownload}>Download old-format csv file</button>
    </div>
  );
}