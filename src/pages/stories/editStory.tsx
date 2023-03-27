import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma, PrismaClient, Recycle, MapItem } from "@prisma/client";
import LeafletAddressLookup from "@/components/findAddress";
import styles from '@/styles/editStory.module.css';
import Image from "next/image";
import { DeepStory } from "@/types";
import Modal from "@/components/deleteModal";
import { educationalPrograms } from "./newStory";
import { Button } from "@nextui-org/react";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";
import { yearLimitsStories } from ".";

// FIX: We have used both organisation and organisation in the code. We should stick to one of them.

export default function EditStory() {
  const router = useRouter();

  // State for the modal
  const [modalState, setModalState] = useState(false);
  // Controlls wheter to show the map or adress search
  // false = adress search, true = map
  const [locationToggle, setLocationToggle] = useState(false);

  // All Story data from the database
  const [allStoryData, setAllStoryData] = useState([{}] as DeepStory[]);
  // ID of the selected project
  const [project, setProject] = useState("");
  // Data for the currently selected story
  const [selectedStoryObject, setSelectedStoryObject] = useState({} as DeepStory);


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
  // Link to any videos
  const [videos, setVideos] = useState("");

  const [openData, setOpenData] = useState("");

  // Whether the project is a proper story or not
  const [energyStory, setEnergyStory] = useState(true);

  // TODO: Show message from API if submission fails
  const [message, setMessage] = useState("");

  // Fetches all data from the database
  const fetchData = async () => {
    const response = await fetch('/api/stories')
    const data = await response.json()
    setAllStoryData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Fetches the story with a specific id from the database
  const fetchSelectedStoryObject = async (id: any) => {
    const response = await fetch('/api/stories?id=' + id)
    const data: DeepStory = await response.json()
    console.log(data)
    setSelectedStoryObject(data)
  }

  // Runs fetchselectedStoryObject function when the project state changes
  useEffect(() => {
    fetchSelectedStoryObject(project)
  }, [project])

  // Sets the states of the form to be the data from the selected project from the database
  useEffect(() => {
    setOrganisation(selectedStoryObject.mapItem?.organisation ? selectedStoryObject.mapItem?.organisation : "")
    setProgram(selectedStoryObject.educationalProgram?.split(", ")[0] as any || "")
    setProgramOrientation(selectedStoryObject.educationalProgram?.split(", ")[1] as any || "")
    setProjectTitle(selectedStoryObject.mapItem?.name as any || "")
    setReportTitle(selectedStoryObject.reportTitle as any)
    setReportLink(selectedStoryObject.reports as any)
    setProjectYear(selectedStoryObject.mapItem?.year as any || "")

    let tempCategories = selectedStoryObject.categorySwedish?.toLowerCase().split(", ") as string[] || [] as string[]
    for (let i = 0; i < tempCategories.length; i++) {
      tempCategories[i] = setFirstLetterCapital(tempCategories[i])
    }
    setCategorys(tempCategories)

    setLat(selectedStoryObject.mapItem?.latitude as any)
    setLon(selectedStoryObject.mapItem?.longitude as any)
    setDescription(selectedStoryObject.descriptionSwedish as any)
    setCaseDescription(selectedStoryObject.pdfCase as any)
    setVideos(selectedStoryObject.videos as any)
    setOpenData(selectedStoryObject.openData as any)
    setEnergyStory(selectedStoryObject.isEnergyStory as any)
  }, [selectedStoryObject])

  const handleSubmit = async (e: any) => {
    // Checks if the form is filled out correctly
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
      }
      // Gets the keys of the searchingFor object and returns them as a strin
      // Sends a post request to the api with the data from the form
      let res = await fetch("/api/stories?id=" + project, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        // What is being sent to the api on susccessful PUT request
        body: JSON.stringify({
          mapItem,
          categorySwedish: !!categorys.join(", ") ? categorys.join(", ") : null,
          educationalProgram: !!programOrientation ? (program + ", " + programOrientation) : !!program ? program : null,
          descriptionSwedish: !!description ? description : null,
          reports: !!reportLink ? reportLink : null,
          reportTitle: !!reportTitle ? reportTitle : null,
          videos: !!videos ? videos : null,
          openData: !!openData ? openData : null,
          pdfCase: !!caseDescription ? caseDescription : null,
          isEnergyStory: energyStory,
        }),
      });

      let resJson = await res.json();
      console.log(resJson)
      // If the PUT request was successful, reset the form and redirect to the home page
      if (res.status >= 200 && res.status < 300) {
        router.push("/stories");
      }
      // If the PUT request was not successful, display the error message
      else {
        // TODO: Actually display this
        setMessage(resJson.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (e: any) => {
    try {
      // Sends a DELETE request to the api with the data from the form
      let res = await fetch("/api/stories?id=" + project, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let resJson = await res.json();
      console.log(resJson)
      // TODO: Make the modal disappear after the delete request is done, whether it was successful or not
      // If the DELETE requset was successful, reset the form and redirect to the home page
      if (res.status >= 200 && res.status < 300) {
        router.push("/stories");
      }
      // If the DELETE request was not successful, display the error message
      else {
        // TODO: Actually display this
        setMessage(resJson.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Make the modal visible or invisible depening on the previous state
  const handleDeleteModalOnclick = () => {
    setModalState(!modalState)
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
  const organisationOptions = () => {
    let mappedData = allStoryData.map((pin: any) => pin.mapItem?.organisation)
    let filteredData = mappedData.filter((organisation: any, index: any) => mappedData.indexOf(organisation) === index && !!organisation).sort()
    return (
      <>
        <option value="" label="Välj organisation" />
        {filteredData.map((pin: any) => {
          return (
            <option key={pin} value={pin} label={pin} />
          )
        })}
      </>
    )
  }

  // Gets all the projects from the database and returns them as options in a select element
  const getProject = () => {
    let mappedData = allStoryData.map((pin: any) => pin)
    return (
      <>
        {mappedData.map((pin: any, index: any) => {
          return (
            <option key={index} value={pin.id?.toString() ?? ""}>{pin.id}: {pin.mapItem?.organisation}: {pin.mapItem?.name}, {pin.mapItem?.year} </option>
          )
        })}
      </>
    )
  }

  // Gets all the categories from the database and returns them as checkboxes
  const getAllCategories = () => {
    let unsplitMaterials: string[] = [];
    allStoryData.map((pin: any) => {
      if (pin.categorySwedish) {
        unsplitMaterials.push(pin.categorySwedish)
      }
    })

    let splitMaterials: string[] = [];
    unsplitMaterials.map((category: any) => {
      splitMaterials.push(...category.split(", ").map((item: any) => setFirstLetterCapital(item.trim().toLowerCase())))
    })
    let filteredCategories = splitMaterials.filter((data: any, index: any) => splitMaterials.indexOf(data) === index && data).sort()

    return filteredCategories
  }

  // Gets all the categories from the 'getAllCategories' and returns them as checkboxes
  const getFilterdCategories = () => {
    let categories = getAllCategories();
    return (
      <>
        {categories.map((category: any, index: any) => {
          return (
            <div className={styles.inputGroup} key={index}>
              <input
                type="checkbox"
                id={index}
                key={index}
                name={category}
                value={category}
                checked={categorys.includes(category)}
                onChange={(e: any) => {
                  if (categorys.includes(e.target.value) && !e.target.checked) {
                    setCategorys(categorys.filter((item: any) => item !== e.target.value))
                  }
                  else if (!categorys.includes(e.target.value) && e.target.checked) {
                    setCategorys([...categorys, e.target.value])
                  }
                }}
              />
              <label htmlFor={index}>{category}</label>
            </div>
          )
        })}
      </>
    )
  }

  // Gets all the educational programs from 'educationalPrograms' imported from newStory and returns them as options in a select element
  const getEducationalPrograms = () => {
    let programs = educationalPrograms;
    return (
      <>
        <option value="" label="Välj program" />

        {programs.map((program: any, index: any) => {
          return (
            <option key={index} value={program}>{program}</option>
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
          <h1 className={styles.addNewPostTitle}>Redigera en story</h1>
          <div className={styles.addNewPostForm}>
            <form method="post">

              {/* Choose project section */}
              <div className={styles.addNewPostFormSelect}>
                <h3>Välj projekt</h3>
                <select
                  id="project"
                  name="project"
                  value={project ?? ""}
                  onChange={(e) => setProject(e.target.value)}
                >
                  <option value="">Välj projekt</option>
                  {getProject()}
                </select>
              </div>

              {/* Organisation section */}
              <div className={styles.addNewPostFormSelect}>
                <h3>Organisation</h3>
                <select
                  id="organisation"
                  name="organisation"
                  value={organisation ?? ""}
                  onChange={(e) => setOrganisation(e.target.value)}
                >
                  {organisationOptions()}
                  <option value="addOrganisation">Lägg till en organisation</option>
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
                    value={newOrganization ?? ""}
                    onChange={(e) => setNewOrganization(e.target.value)}
                  />
                </div>
              )}

              {/* Program section */}
              <div className={styles.addNewPostFormSelect}>
                <h3>Program</h3>
                <select
                  id="program"
                  name="program"
                  value={program ?? ""}
                  onChange={(e: any) => setProgram(e.target.value)}
                >
                  {getEducationalPrograms()}
                </select>
              </div>

              {/* Program orientation section */}
              {
                program === "Agronom" || program === "Civilingenjör" || program === "Högskoleingenjör" || program === "Kandidatprogram" ?
                  <div className={styles.addNewPostFormOrientation}>
                    <h3>Programinriktning</h3>
                    <input
                      type="text"
                      key={program}
                      id={program}
                      name={program}
                      value={programOrientation ?? ""}
                      onChange={(e) => setProgramOrientation(e.target.value)}
                    />
                  </div>
                  :
                  null

              }

              {/* Title section */}
              <div className={styles.addNewPostFormTitle}>
                <h3>Casetitel</h3>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={projectTitle ?? ""}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>

              {/* Report section */}
              <div className={styles.addNewPostFormName}>
                <h3>Rapporttitel</h3>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={reportTitle ?? ""}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>

              {/* Report link section */}
              <div className={styles.addNewPostFormName}>
                <h3>Länk till rapport</h3>
                <input
                  type="text"
                  id="reportLink"
                  name="reportLink"
                  value={reportLink ?? ""}
                  onChange={(e) => setReportLink(e.target.value)}
                />
              </div>

              {/* Start year section */}
              <div className={styles.startYear}>
                <h3>År</h3>
                <input
                  type="number"
                  id="startYear"
                  name="startYear"
                  value={projectYear ?? ""}
                  min={yearLimitsStories.min}
                  onChange={(e) => setProjectYear(e.target.value)}
                />
              </div>

              {/* Category section */}
              <div className={styles.addNewPostForm}>
                <h3>Kategorier</h3>
                <div className={styles.optionList}>
                  <div className={styles.form}>
                    {getFilterdCategories()}
                  </div>
                </div>
              </div>

              {/* Location section */}
              <div className={styles.addNewPostFormLocation}>
                <h3>Plats *</h3>
                { // The map switch is hidden if no project is selected (by checking if mapItem exists)
                  !!selectedStoryObject.mapItem &&
                  <div className={styles.switch}>
                    <input
                      id="switch-1"
                      type="checkbox"
                      className={styles.switchInput}
                      onChange={(e) => setLocationToggle(e.target.checked)}
                    />
                    <label htmlFor="switch-1" className={styles.switchLabel}>Switch</label>
                  </div>}
                {
                  locationToggle === true ?
                    <>
                      <NewPostMap
                        setLat={setLat}
                        setLon={setLon}
                        lat={lat ?? ''}
                        lon={lon ?? ''}
                        defaultLat={selectedStoryObject.mapItem?.latitude || 59.8586}
                        defaultLon={selectedStoryObject.mapItem?.longitude || 17.6389}
                      />
                    </>
                    :
                    <LeafletAddressLookup
                      setLat={setLat}
                      setLon={setLon}
                      lat={lat ?? ''}
                      lon={lon ?? ''}
                    />
                }
              </div>

              {/* Description section */}
              <div className={styles.addNewPostFormDescription}>
                <h3 style={{ marginTop: "10px" }}>Sammanfatting</h3>
                <textarea
                  id="description"
                  name="description"
                  maxLength={3000}
                  value={description ?? ""}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div >

              {/* Link to case section */}
              <div className={styles.addNewPostFormContact}>
                <h3>Länk till case-beskrivning</h3>
                <textarea
                  id="caseDescription"
                  name="caseDescription"
                  value={caseDescription ?? ""}
                  onChange={(e) => setCaseDescription(e.target.value)}
                />
              </div >

              {/* External links section */}
              <div className={styles.addNewPostFormExternalLinks}>
                <h3>Videolänk</h3>
                <textarea
                  id="videos"
                  name="videos"
                  placeholder="Ex: https://www.youtube.com/embed/dQw4w9WgXcQ"
                  value={videos ?? ""}
                  onChange={(e) => setVideos(e.target.value)}
                />
              </div >

              {/* OpenData section */}
              <div className={styles.openData}>
                <h3>Länk till eventuell öppen data?</h3>
                <textarea
                  id="openData"
                  name="openData"
                  value={openData ?? ""}
                  onChange={(e) => setOpenData(e.target.value)}
                />
              </div>

              {/* isEnergystory section */}
              <div style={{ marginTop: "10px" }}>
                <h3>Är det ett stories projekt?</h3>
                <input
                  type="checkbox"
                  id="energyStory"
                  name="energyStory"
                  value="energyStory"
                  checked={energyStory ?? false}
                  onChange={(e) => setEnergyStory(e.target.checked)}
                />
                {
                  energyStory === true ?
                    <p>Ja</p>
                    :
                    <p>Nej</p>
                }
              </div>
              <div className={styles.message}>{message ? <p>{message}</p> : null}</div>
            </form>

            {/* Submit and delete button */}
            <div className={styles.btnAlignContainer}>
              <div className={styles.addNewPostFormSubmit}>
                <Button id={styles.save} type="submit" onClick={handleSubmit}> Spara </Button>
              </div>
              <div className={styles.addNewPostFormSubmit}>
                <Button id={styles.remove} onClick={handleDeleteModalOnclick}> Ta bort </Button>
                <Modal toggle={modalState} action={handleDeleteModalOnclick} handleDelete={handleDelete} />
              </div>
            </div>
          </div >
        </div >
      </div >

      {/* Footer */}
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