import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma } from "@prisma/client";
import LeafletAddressLookup from "@/components/findAddress";
import { DeepStory } from "@/types";
import Modal from "@/components/deleteModal";
import { basePrograms, educationalPrograms } from "./newStory";
import { dataPortals } from "./newStory";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";
import { yearLimitsStories } from "..";
import { storyCategories } from "@/functions/storiesSidebar";
import LinkIcon from "@/components/linkIcon";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

// TODO: We have used both organisation and organization in the code. We should stick to one of them.

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
  // Free text input for creating new educational program
  const [newProgram, setNewProgram] = useState("");
  // Title of the project, is shown on the map
  const [projectTitle, setProjectTitle] = useState("");
  // Title of the report, used when searching for it in the linked website
  const [reportTitle, setReportTitle] = useState("");
  // Link to the report, either directly or to the website where the report will be published
  const [reportLink, setReportLink] = useState("");
  // Year the project was completed
  const [projectYear, setProjectYear] = useState("");
  // Categories of the project
  const [categorArray, setCategorArray] = useState([] as string[]);
  // Coordinates
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  // Description, is shown on the website in a dropdown
  const [description, setDescription] = useState("");
  // Link to case description
  const [caseDescription, setCaseDescription] = useState("");
  // Link to any videos
  const [videos, setVideos] = useState("");
  // Link to any open data site
  const [openData, setOpenData] = useState("");
  // Name of the author/-s of the report
  const [authorName, setAuthorName] = useState("");
  // Contact information for the author/-s of the report
  const [authorContact, setAuthorContact] = useState("");
  // Whether the project is a proper story or not
  // Non-stories are mostly the solar data from energiportalen
  const [energyStory, setEnergyStory] = useState(true);
  // State for the data portal
  const [dataPortal, setDataPortal] = useState("");

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

  /** Fetches the story with a specific id from the database */
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
    setProgram(selectedStoryObject.educationalProgram as any || "")

    setProjectTitle(selectedStoryObject.mapItem?.name as any || "")
    setReportTitle(selectedStoryObject.reportTitle as any)
    setDataPortal(selectedStoryObject.reportSite as any)
    setReportLink(selectedStoryObject.reportLink as any)
    setProjectYear(selectedStoryObject.mapItem?.year as any || "")

    let tempCategories = selectedStoryObject.categorySwedish?.toLowerCase().split(", ") as string[] || [] as string[]
    for (let i = 0; i < tempCategories.length; i++) {
      tempCategories[i] = setFirstLetterCapital(tempCategories[i])
    }
    setCategorArray(tempCategories)

    setLat(selectedStoryObject.mapItem?.latitude as any)
    setLon(selectedStoryObject.mapItem?.longitude as any)
    setDescription(selectedStoryObject.descriptionSwedish as any)
    setCaseDescription(selectedStoryObject.pdfCase as any)
    setVideos(selectedStoryObject.videos as any)
    setOpenData(selectedStoryObject.openData as any)
    setAuthorName(selectedStoryObject.reportAuthor as any)
    setAuthorContact(selectedStoryObject.reportContact as any)
    setEnergyStory(selectedStoryObject.isEnergyStory as any)
  }, [selectedStoryObject])

  /** Handles the submission of the form */
  const handleSubmit = async (e: any) => {
    // Prevents the page from sometimes reloading on submit, fixes a bug where the data wasn't always sent properly
    try { e.preventDefault() }
    catch { }

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
          categorySwedish: !!categorArray.join(", ") ? categorArray.join(", ") : null,
          educationalProgram: !!program ? program == "addOrientation" ? setFirstLetterCapital(newProgram.toLowerCase()) : program : null,
          descriptionSwedish: !!description ? description : null,
          reportLink: !!reportLink ? reportLink : null,
          reportSite: !!dataPortal ? dataPortal : null,
          reportTitle: !!reportTitle ? reportTitle : null,
          videos: !!videos ? videos : null,
          openData: !!openData ? openData : null,
          pdfCase: !!caseDescription ? caseDescription : null,
          reportAuthor: !!authorName ? authorName : null,
          reportContact: !!authorContact ? authorContact : null,
          isEnergyStory: energyStory,
        }),
      });

      let resJson = await res.json();
      console.log(resJson)
      // If the PUT request was successful, reset the form and redirect to the home page
      if (res.status >= 200 && res.status < 300) {
        router.push("/" + window.location.search);
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

  /** Handles delete requests */
  const handleDelete = async (e: any) => {
    // Prevents the page from sometimes reloading on submit, fixes a bug where the data wasn't always sent properly
    try { e.preventDefault() }
    catch { }

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
        router.push("/" + window.location.search);
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

  /** Make the modal visible or invisible depening on the previous state */
  const handleDeleteModalOnclick = () => {
    setModalState(!modalState)
  }


  // Render the newPostMap component, but only on the client side. Otherwise the website gets an hydration error
  const NewPostMap = React.useMemo(() => dynamic(
    () => import('../../components/newPostMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  /** Gets all programs from the database, combines them with the base programs, and returns them as options in a select element */
  const getOrientation = () => {
    let programs: string[] = allStoryData.map((pin: any) => pin.educationalProgram);
    let combinedPrograms = programs.concat(basePrograms);
    // Sets the first letter of each program to uppercase and all other letters to lowercase
    let formattedPrograms = combinedPrograms.map((program: string) => !!program ? setFirstLetterCapital(program.toLowerCase()) : "");
    let filteredData = formattedPrograms
      .filter(
        (program: any, index: any) =>
          formattedPrograms.indexOf(program) === index && !!formattedPrograms[index]
      )
      .sort();
    return (
      <>
        {filteredData.map((program: any, index: any) => {
          return (
            <option key={program} value={program} label={program} />
          );
        })}
      </>
    );
  }

  /** Gets all the organisations from the database and returns them as options in a select element */
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

  /** Gets all the projects from the database and returns them as options in a select element */
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

  /** Gets all the categories from the list in storiesSidebar and returns them as an array */
  const getAllCategories = () => {
    let categories = Object.keys(storyCategories)

    // Sets the first letter of each category to uppercase and all other letters to lowercase, and replaces all dashes with spaces
    categories = categories.map((category: any) => setFirstLetterCapital(category.trim().toLowerCase().replaceAll("-", " ")))

    return categories
  }

  /** Gets categories from 'getAllCategories' and returns them as checkboxes */
  const getFilterdCategories = () => {
    let categories = getAllCategories();
    return (
      <>
        {categories.map((category: any, index: any) => {
          return (
            <div key={index} className="display-flex align-items-center gap-50">
              <input
                type="checkbox"
                id={index}
                key={index}
                name={category}
                value={category}
                checked={categorArray.includes(category)}
                onChange={(e: any) => {
                  if (categorArray.includes(e.target.value) && !e.target.checked) {
                    setCategorArray(categorArray.filter((item: any) => item !== e.target.value))
                  }
                  else if (!categorArray.includes(e.target.value) && e.target.checked) {
                    setCategorArray([...categorArray, e.target.value])
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

  /** Gets all the data portals from 'dataPortals' imported from newStory and returns them as radio buttons */
  const getDataPortals = () => {
    return (
      <>
        {Object.keys(dataPortals).map((portal: any) => {
          return (
            <div key={portal} className="display-flex align-items-center gap-50">
              <input
                type="radio"
                id={portal}
                name="dataPortal"
                value={dataPortals[portal]}
                checked={dataPortal === dataPortals[portal]}
                onChange={(e) => setDataPortal(e.target.value)}
              />
              <label htmlFor={portal}>{portal} </label>
            </div>
          )
        })}
      </>
    )
  }

  /** Gets all the educational programs from 'educationalPrograms' imported from newStory and returns them as options in a select element */
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
        <title>Ändra en story</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <Header />
      <div className="layout-main">
        <h1 className="display-flex align-items-center gap-50">
          <LinkIcon src="/back.svg" alt="back" />
          Redigera en story
        </h1>
        <main className="margin-y-100">
          <form method="post" onSubmit={handleSubmit}>

            {/* Choose project section */}
            <label htmlFor="project"><h2>Välj projekt</h2></label>
            <select
              id="project"
              name="project"
              value={project ?? ""}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="">Välj projekt</option>
              {getProject()}
            </select>

            {/* Organisation section */}
            <label htmlFor="organisation">Organisation</label>
            <select
              id="organisation"
              name="organisation"
              value={organisation ?? ""}
              onChange={(e) => setOrganisation(e.target.value)}
            >
              {organisationOptions()}
              <option value="addOrganisation">Lägg till en organisation</option>
            </select>

            {/* Input field for adding a new organisation if addOrganisation is selected */}
            {organisation === "addOrganisation" && (
              <div>
                <label htmlFor="newOrganization">Ny organisation</label>
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
            <label htmlFor="program">Program</label>
            <select
              id="program"
              name="program"
              value={program ?? ""}
              onChange={(e: any) => setProgram(e.target.value)}
            >
              <option value="" label="Välj program" />
              {getOrientation()}
              <option value="addOrientation" label="Lägg till ny programinriktning" />
            </select>
            {/* Add new program */}
            {
              program === "addOrientation" ?
                <div>
                  <label htmlFor={program}>Programinriktning</label>
                  <input
                    type="text"
                    id={program}
                    name={program}
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                  />
                </div>
                :
                null
            }

            {/* Title section */}
            <label htmlFor="title">Casetitel</label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectTitle ?? ""}
              onChange={(e) => setProjectTitle(e.target.value)}
            />

            {/* Report section */}
            <label htmlFor="name">Rapporttitel</label>
            <input
              type="text"
              id="name"
              name="name"
              value={reportTitle ?? ""}
              onChange={(e) => setReportTitle(e.target.value)}
            />

            {/* Selection of which data portal the report is/will be published on */}
            <strong>Dataportal där rapporten är/kommer vara</strong>
            {getDataPortals()}


            {/* Report link section */}
            <label htmlFor="reportLink">Länk till rapport</label>
            <input
              type="text"
              id="reportLink"
              name="reportLink"
              value={reportLink ?? ""}
              onChange={(e) => setReportLink(e.target.value)}
            />

            {/* Start year section */}
            <label htmlFor="startYear">År</label>
            <input
              type="number"
              id="startYear"
              name="startYear"
              value={projectYear ?? ""}
              min={yearLimitsStories.min}
              onChange={(e) => setProjectYear(e.target.value)}
            />

            {/* Category section */}
            <strong>Kategorier</strong>
            {getFilterdCategories()}

            {/* Location section */}
            <strong>Plats</strong>
            { // The map switch is hidden if no project is selected (by checking if mapItem exists)
              !!selectedStoryObject.mapItem &&
              <div>
                <input
                  id="switch-1"
                  type="checkbox"
                  onChange={(e) => setLocationToggle(e.target.checked)}
                />
                <label htmlFor="switch-1">Switch</label>
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

            {/* Description section */}
            <label htmlFor="description">Sammanfatting</label>
            <textarea
              id="description"
              name="description"
              maxLength={3000}
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
            />

            <section className="grid-auto-rows">

              {/* Link to case section */}
              <div>
                <label htmlFor="caseDescription">Länk till case-beskrivning</label>
                <input type="text"
                  id="caseDescription"
                  name="caseDescription"
                  value={caseDescription ?? ""}
                  onChange={(e) => setCaseDescription(e.target.value)}
                />
              </div>

              {/* External links section */}
              <div>
                <label htmlFor="videos">Videolänk</label>
                <input type="text"
                  id="videos"
                  name="videos"
                  placeholder="Ex: https://www.youtube.com/embed/dQw4w9WgXcQ"
                  value={videos ?? ""}
                  onChange={(e) => setVideos(e.target.value)}
                />
              </div>

              {/* OpenData section */}
              <div>
                <label htmlFor="openData">Länk till eventuell öppen data?</label>
                <input type="text"
                  id="openData"
                  name="openData"
                  value={openData ?? ""}
                  onChange={(e) => setOpenData(e.target.value)}
                />
              </div>
            </section>

            {/* Author section */}
            <label htmlFor="authorName">Namn på författare</label>
            <input type="text"
              id="authorName"
              name="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />

            {/*Contact section */}
            <label htmlFor="authorContact">Kontaktuppgifter</label>
            <textarea
              id="authorContact"
              name="authorContact"
              value={authorContact}
              onChange={(e) => setAuthorContact(e.target.value)}
            />

            {/* isEnergystory section */}
            <strong>Är det ett stories projekt?</strong>
            <div className="display-flex align-items-center gap-50">
              <input
                type="checkbox"
                id="energyStory"
                name="energyStory"
                value="energyStory"
                checked={energyStory ?? false}
                onChange={(e) => setEnergyStory(e.target.checked)}
              />
              <label htmlFor="energyStory" style={{ margin: 0 }}>
                {
                  energyStory === true ?
                    <span>Ja</span>
                    :
                    <span>Nej</span>
                }</label>
              <div>{message ? <p>{message}</p> : null}</div></div>

            {/* Submit and delete button */}
            <div className="display-flex gap-50">
              <input type="submit" id="save" onClick={handleSubmit} value="spara" />
              <button id="remove" onClick={handleDeleteModalOnclick} className="danger"> Ta bort story </button>
            </div>
            <Modal toggle={modalState} action={handleDeleteModalOnclick} handleDelete={handleDelete} />
          </form>
        </main>
      </div>

      {/* Footer */}
      <Footer />

    </>
  );
}