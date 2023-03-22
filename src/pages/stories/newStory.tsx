import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma, PrismaClient, Recycle, MapItem } from "@prisma/client";
import LeafletAddressLookup from "@/components/findAddress";
import styles from '@/styles/newStory.module.css';
import Image from "next/image";
import { yearLimitsStories } from "./index";
import { Button } from "@nextui-org/react";


// FIX: We have used both organisation and organization in the code. We should stick to one of them.

//Array containing all the allowed educational programs
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
    const response = await fetch('http://localhost:3000/api/stories')
    const data = await response.json()
    setStoriesData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Data from the database is stored in this state
  const [storiesData, setStoriesData] = useState([]);

  // All the states used in the form, where the data is stored until the form is susccessfully submitted
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

  const [organization, setOrganization] = useState("");

  const [program, setProgram] = useState("");
  const [programOrientation, setProgramOrientation] = useState("");

  const [title, setTitle] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [startYear, setStartYear] = useState("");
  const [categorys, setCategorys] = useState([] as string[]);
  const [description, setDescription] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [videos, setVideos] = useState("");
  const [energyStory, setEnergyStory] = useState(true);
  const [message, setMessage] = useState("");
  const [locationToggle, setLocationToggle] = useState(false);


  // Handles the submit of the form
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Checks if the form is filled out correctly
    try {
      let mapItem: Prisma.MapItemCreateInput = {
        latitude: lat ? parseFloat(lat) : null,
        longitude: lon ? parseFloat(lon) : null,
        address: "",
        postcode: parseInt(""),
        city: "",
        organisation: organization,
        year: parseInt(startYear),
        name: title,
      }
      // Gets the keys of the searchingFor object and returns them as a strin
      // Sends a post request to the api with the data from the form
      let res = await fetch("http://localhost:3000/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // What is being sent to the api
        body: JSON.stringify({
          mapItem,
          categorySwedish: categorys.join(", "),
          educationalProgram: program,
          descriptionSwedish: description,
          reports: reportLink,
          reportTitle,
          videos,
          pdfCase: caseDescription,
          isEnergyStory: energyStory,
        }),
      });

      //TODO: Remove this console.log when the form is working properly and we don't need to see the data anymore
      console.log(JSON.stringify({
        mapItem,
        categorySwedish: categorys.join(", "),
        educationalProgram: programOrientation ? (program + ", " + programOrientation) : program,
        descriptionSwedish: description,
        reports: reportLink,
        reportTitle,
        videos,
        pdfCase: caseDescription,
        isEnergyStory: energyStory,
      })
      );


      let resJson = await res.json();
      if (res.status >= 200 && res.status < 300) {
        // If the post was successful, reset the form and redirect to the home page
        router.push("/stories");

        // If the post was not successful, display the error message
      } else {
        setMessage(resJson.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Redner the newPostMap component, but only on the client side. Otherwise the website gets an hydration error
  const NewPostMap = React.useMemo(() => dynamic(
    () => import('../../components/newPostMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  // Gets all the organisations from the database and returns them as options in a select element
  const getOrganisation = () => {
    let mappedData = storiesData.map((pin: any) => pin.mapItem.organisation)
    let filteredData = mappedData.filter((pin: any, index: any) => mappedData.indexOf(pin) === index).sort()
    return (
      <>
        {filteredData.map((pin: any, index: any) => {
          return (
            <option key={pin} value={pin}>{pin}</option>
          )
        })}
      </>
    )
  }

  // Gets all the categories from the database and returns them as checkboxes
  const getAllCategories = () => {
    let unsplitCategories: string[] = [];
    storiesData.map((pin: any) => {
      if (pin.categorySwedish) {
        unsplitCategories.push(pin.categorySwedish)
      }
    })

    let splitCategories: string[] = [];
    unsplitCategories.map((category: any) => {
      // Adds the splited categories to the splitCategories array and sets it to lowercase
      splitCategories.push(...category.split(", ").map((item: any) => item.trim().toLowerCase()))
    })

    // Removes duplicates and sorts the array
    let filteredCategories = splitCategories.filter((data: any, index: any) => splitCategories.indexOf(data) === index && data).sort()

    return filteredCategories
  }

  // Gets all the categories from the 'getAllCatagories' function and returns them as checkboxes
  const getFilterdCategories = () => {
    let categories = getAllCategories();
    return (
      <>
        {categories.map((category: any) => {
          return (
            <div className={styles.typeInputGroup} key={category}>
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
        }
        )}
      </>
    )
  }

  const getEducationalPrograms = () => {
    let programs = educationalPrograms;
    return (
      <>
        {programs.map((program: any) => {
          return (
            <option key={program} value={program}>{program}</option>
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
            <form method="post" onSubmit={handleSubmit}>
              {/*Oraganisation section */}
              <div className={styles.addNewPostFormSelect}>
                <h3>Organisation *</h3>
                {/*
                // TODO: Add text input if the user chooses a specific option in the select, to allow adding a new organisation
                                if you want to use the text input instead of the select, comment out the select and uncomment the text input 
                                <input
                                    type="text"
                                    id="organization"
                                    name="organization"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    required
                                /> */}
                <select
                  id="organization"
                  name="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                >
                  <option value="">Välj organisation</option>
                  {getOrganisation()}

                </select>
              </div>
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
                <h3>Titel</h3>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/*Report section */}
              <div className={styles.addNewPostFormName}>
                <h3>Rapportnamn</h3>
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
                <h3>Startår</h3>
                <input
                  type="number"
                  id="startYear"
                  name="startYear"
                  value={startYear}
                  min={yearLimitsStories.min}
                  onChange={(e) => setStartYear(e.target.value)}
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
                <h3 style={{ marginTop: "10px" }}>Beskrivning *</h3>
                <textarea
                  id="description"
                  name="description"
                  rows={10}
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
                  rows={1}
                  cols={100}
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
                  rows={1}
                  cols={100}
                  value={videos}
                  onChange={(e) => setVideos(e.target.value)}
                />
              </div >

              {/*isEnergystory section */}
              <div className={styles.energyStory}>
                <h3>Är det en energy story?</h3>
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
                <Button id={styles.save} type="submit" > Spara</Button >
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