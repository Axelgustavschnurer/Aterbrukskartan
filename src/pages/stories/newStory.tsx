import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma, PrismaClient, Recycle, MapItem } from "@prisma/client";
import LeafletAddressLookup from "@/components/findAddress";
import styles from '@/styles/newStory.module.css';
import Image from "next/image";
import { yearLimitsStories } from "../index";
import { Button } from "@nextui-org/react";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";
import { storyCategories } from "@/functions/storiesSidebar";

/** Array containing all the allowed educational programs */
export const educationalPrograms: string[] = [
  "Agronom",
  "Civilingenjör",
  "Högskoleingenjör",
  "Kandidatprogram",
];

export default function AddNewStory() {
  const router = useRouter();

  // Fetches all the data from the database
  const fetchData = async () => {
    const response = await fetch('/api/stories')
    const data = await response.json()
    setStoriesData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Controlls wheter to show the map or adress search
  // false = adress search, true = map
  const [locationToggle, setLocationToggle] = useState(false);

  // Data from the database is stored in this state
  const [storiesData, setStoriesData] = useState([]);

  // All the states used in the form, where the data is stored until the form is susccessfully submitted
  // Currently selected organisation
  const [organisation, setOrganisation] = useState("");
  // Text in the input field for adding a new organisation
  const [newOrganization, setNewOrganization] = useState("");
  // Currently selected educational program
  const [program, setProgram] = useState("");
  // Free text input for specifying the orientation of the educational program
  const [programOrientation, setProgramOrientation] = useState("");
  // Title of the project, is shown on the map
  const [projectTitle, setProjectTitle] = useState("");
  // Title of the report, used when searching for it in the linked website
  const [reportTitle, setReportTitle] = useState("");
  // Link to the report, either directly or to the website where the report will be published
  const [reportLink, setReportLink] = useState("");
  // Year the project was completed
  const [projectYear, setProjectYear] = useState("");
  // Categories of the project
  const [categorys, setCategorys] = useState([] as string[]);
  // Coordinates
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  // Description, is shown on the website in a dropdown
  const [description, setDescription] = useState("");
  // Link to case description
  const [caseDescription, setCaseDescription] = useState("");
  // Link to open data
  const [openData, setOpenData] = useState("");
  // Link to any videos
  const [videos, setVideos] = useState("");
  // Whether the project is a proper story or not
  const [energyStory, setEnergyStory] = useState(true);

  const [message, setMessage] = useState("");


  /** Handles the submit of the form */
  const handleSubmit = async (e: any) => {
    try {
      // TODO: implement address, postcode and city
      // Sets the content of the mapItem object
      let mapItem: Prisma.MapItemCreateInput = {
        latitude: !!lat ? parseFloat(lat) : null,
        longitude: !!lon ? parseFloat(lon) : null,
        address: !!"" ? "" : null,
        postcode: !!parseInt("") ? parseInt("") : null,
        city: !!"" ? "" : null,
        organisation: !!organisation && organisation != "addOrganisation" ? organisation : !!newOrganization ? newOrganization : null,
        year: !!parseInt(projectYear) ? parseInt(projectYear) : null,
        name: !!projectTitle ? projectTitle : null,
      };

      // Sends a post request to the api with the data from the form
      let res = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // What is being sent to the api
        body: JSON.stringify({
          mapItem,
          categorySwedish: !!categorys.join(", ") ? categorys.join(", ") : null,
          educationalProgram: !!programOrientation ? (program + ", " + programOrientation) : !!program ? program : null,
          descriptionSwedish: !!description ? description : null,
          reports: !!reportLink ? reportLink : null,
          reportTitle: !!reportTitle ? reportTitle : null,
          videos: !!videos ? videos : null,
          pdfCase: !!caseDescription ? caseDescription : null,
          openData: !!openData ? openData : null,
          isEnergyStory: energyStory,
        }),
      });

      let resJson = await res.json();

      // If the post was successful, redirect to the home page
      if (res.status >= 200 && res.status < 300) {
        router.push("/" + window.location.search);
      }
      // If the post was not successful, display the error message
      else {
        setMessage(resJson.message);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  // Render the newPostMap component, but only on the client side. Otherwise the website gets an hydration error
  const NewPostMap = React.useMemo(() => dynamic(
    () => import('@/components/newPostMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  /** Gets all the organisations from the database and returns them as options in a select element */
  const getOrganisation = () => {
    let organisations = storiesData.map((pin: any) => pin.mapItem.organisation)
    let filteredOrganisations = organisations.filter((org: any, index: any) => organisations.indexOf(org) === index && !!org).sort()
    return (
      <>
        {filteredOrganisations.map((org: any, index: any) => {
          return (
            <option key={org} value={org} label={org} />
          )
        })}
      </>
    )
  }

  /** Gets all the categories from the list in storiesSidebar and returns them as an array */
  const getAllCategories = () => {
    let categories = Object.keys(storyCategories)

    // Sets the first letter of each category to uppercase and all other letters to lowercase, and replaces all dashes with spaces
    categories = categories.map((category: any) => setFirstLetterCapital(category.trim().toLowerCase().replaceAll("-", " ")))

    return categories
  }

  /** Gets all the categories from the 'getAllCatagories' function and returns them as checkboxes */
  const getFilterdCategories = () => {
    let categories = getAllCategories();
    return (
      <>
        {categories.map((category: any) => {
          return (
            <div className={styles.inputGroup} key={category}>
              <input
                type="checkbox"
                id={category}
                name={category}
                value={category}
                onClick={(e: any) => {
                  if (categorys.includes(e.target.value) && !e.target.checked) {
                    setCategorys(categorys.filter((item: any) => item !== e.target.value))
                  }
                  else if (!categorys.includes(e.target.value) && e.target.checked) {
                    setCategorys([...categorys, e.target.value])
                  }
                }}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          )
        })}
      </>
    )
  }

  /** Gets all the educational programs from the `educationalPrograms` list and returns them as options in a select element */
  const getEducationalPrograms = () => {
    return (
      <>
        {educationalPrograms.map((program: any) => {
          return (
            <option key={program} value={program} label={program} />
          )
        })}
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Lägg till story</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <div className={styles.header} id={styles.header}>
        <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
      </div>

      <div className={styles.addPostContainer}>
        <div className={styles.addNewPostContainer}>
          <h1 className={styles.addNewPostTitle}>Lägg till en ny story</h1>
          <div className={styles.addNewPostForm}>
            <form method="post">
              {/*Oraganisation section */}
              <div className={styles.addNewPostFormSelect}>
                <h3>Organisation *</h3>
                <select
                  id="organisation"
                  name="organisation"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                >
                  <option value="" label="Välj organisation" />
                  {getOrganisation()}
                  <option value="addOrganisation" label="Lägg till ny organisation" />
                </select>
              </div>

              {organisation === "addOrganisation" && (
                <div className={styles.addNewPostFormInput}>
                  <h3>Ny organisation</h3>
                  <input
                    type="text"
                    key="newOrganization"
                    id="newOrganization"
                    name="newOrganization"
                    value={newOrganization}
                    onChange={(e) => setNewOrganization(e.target.value)}
                  />
                </div>
              )}

              {/*Program section */}
              <div className={styles.addNewPostFormSelect}>
                <h3>Program *</h3>
                <select
                  id="program"
                  name="program"
                  value={program}
                  onChange={(e: any) => setProgram(e.target.value)}
                >
                  <option value="">Välj program</option>
                  {getEducationalPrograms()}
                </select>
              </div>
              {/*Program orientation section */}
              {
                program ?
                  <div className={styles.addNewPostFormOrientation}>
                    <h3>Programinriktning *</h3>
                    <input
                      type="text"
                      id={program}
                      name={program}
                      value={programOrientation}
                      onChange={(e) => setProgramOrientation(e.target.value)}
                    />
                  </div>
                  :
                  null
              }

              {/*Title section */}
              <div className={styles.addNewPostFormTitle}>
                <h3>Casetitel</h3>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>

              {/*Report section */}
              <div className={styles.addNewPostFormName}>
                <h3>Rapporttitel</h3>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>

              {/*Report link section */}
              <div className={styles.addNewPostFormName}>
                <h3>Länk till rapport</h3>
                <input
                  type="text"
                  id="reportLink"
                  name="reportLink"
                  value={reportLink}
                  onChange={(e) => setReportLink(e.target.value)}
                />
              </div>

              {/*Start year section */}
              <div className={styles.startYear}>
                <h3>År</h3>
                <input
                  type="number"
                  id="startYear"
                  name="startYear"
                  value={projectYear}
                  min={yearLimitsStories.min}
                  onChange={(e) => setProjectYear(e.target.value)}
                />
              </div>

              {/*Category section */}
              <div className={styles.addNewPostForm}>
                <h3>Kategorier</h3>
                <div className={styles.optionList}>
                  <div className={styles.form}>
                    {getFilterdCategories()}
                  </div>
                </div>
              </div>

              {/*Location section */}
              <div className={styles.addNewPostFormLocation}>
                <h3>Plats *</h3>
                <div className={styles.switch}>
                  <input
                    id="switch-1"
                    type="checkbox"
                    className={styles.switchInput}
                    onChange={(e) => setLocationToggle(e.target.checked)}
                  />
                  {/* If you want to switch to map, uncomment this part*/}
                  <label htmlFor="switch-1" className={styles.switchLabel}>Switch</label>
                </div>
                {
                  locationToggle === true ?
                    <>
                      <NewPostMap
                        setLat={setLat}
                        setLon={setLon}
                        lat={lat}
                        lon={lon}
                      />
                    </>
                    :
                    <LeafletAddressLookup
                      setLat={setLat}
                      setLon={setLon}
                      lat={lat}
                      lon={lon}
                    />
                }
              </div>

              {/*Description section */}
              <div className={styles.addNewPostFormDescription}>
                <h3 style={{ marginTop: "10px" }}>Sammanfattning *</h3>
                <textarea
                  id="description"
                  name="description"
                  maxLength={3000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div >

              {/*Link to case section */}
              <div className={styles.addNewPostFormContact}>
                <h3>Länk till case-beskrivning *</h3>
                <textarea
                  id="caseDescription"
                  name="caseDescription"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                />
              </div >

              {/*External links section */}
              <div className={styles.addNewPostFormExternalLinks}>
                <h3>Videolänk</h3>
                <textarea
                  id="videos"
                  name="videos"
                  placeholder="Ex: https://www.youtube.com/embed/dQw4w9WgXcQ"
                  value={videos}
                  onChange={(e) => setVideos(e.target.value)}
                />
              </div >

              {/*OpenData section */}
              <div className={styles.openData}>
                <h3>Länk till eventuell öppen data</h3>
                <textarea
                  id="openData"
                  name="openData"
                  value={openData}
                  onChange={(e) => setOpenData(e.target.value)}
                />
              </div >

              {/*isEnergystory section */}
              <div style={{ marginTop: "10px" }}>
                <h3>Är det ett stories projekt?</h3>
                <input
                  type="checkbox"
                  id="energyStory"
                  name="energyStory"
                  value="energyStory"
                  defaultChecked={energyStory}
                  onChange={(e) => setEnergyStory(e.target.checked)}
                />
                {
                  energyStory === true ?
                    <p>Ja</p>
                    :
                    <p>Nej</p>
                }
              </div>

              {/*Submit button section */}
              <div className={styles.addNewPostFormSubmit}>
                <Button id={styles.save} type="submit" onClick={handleSubmit} > Spara</Button >
              </div >
              <div className={styles.message}>{message ? <p>{message}</p> : null}</div>
            </form >
          </div >
        </div >
      </div >

      {/*Footer section */}
      <div className={styles.footer} id={styles.footer}>
        < div className={styles.footerContainer}>
          <div className={styles.footerRow}>
            <div className={styles.footerHeader}>STUNS</div>
            <div className={styles.footerLink}>
              <a href="https://stuns.se/" target="_blank" rel="noreferrer">
                STUNS
              </a>
            </div >
          </div >
        </div >
      </div >
    </>
  );
}