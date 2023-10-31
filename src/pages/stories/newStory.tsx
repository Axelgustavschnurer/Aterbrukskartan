import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma } from "@prisma/client";
import LeafletAddressLookup from "@/components/findAddress";
import { yearLimitsStories } from "./index";
import LinkIcon from "@/components/buttons/backButton";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";
import { storyCategories } from "@/components/aside/storiesSidebar";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

/** Array containing all the allowed educational programs */
export const educationalPrograms: string[] = [
  "Agronom",
  "Civilingenjör",
  "Högskoleingenjör",
  "Kandidatprogram",
  "Masterprogram",
];

/**
 * A base list of educational programs and their orientations
 * Should be combined with the data from the database to get all the programs and orientations
 */
export const basePrograms: string[] = [
  "Agronom, landsbygdsutveckling",
  "Agronom, markväxt",
  "Civilingenjör, elektroteknik",
  "Civilingenjör, energisystem",
  "Civilingenjör, informationsteknik",
  "Civilingenjör, kemiteknik",
  "Civilingenjör, medicinsk teknik",
  "Civilingenjör, miljö- och vattenteknik",
  "Civilingenjör, molykelär bioteknik",
  "Civilingenjör, system i teknik och samhälle",
  "Civilingenjör, teknisk fysik",
  "Civilingenjör, teknisk fysik inriktning materialvetenskap",
  "Högskoleingenjör, byggteknik",
  "Högskoleingenjör, landskapsingenjör",
  "Kandidatprogram, biologi och miljövetenskap",
  "Kandidatprogram, datavetenskap",
  "Kandidatprogram, ekonomi hållbar utveckling",
  "Kandidatprogram, kultur, samhälle och etnografi",
  "Kandidatprogram, landskapsarkitekt",
  "Kandidatprogram, medie- och kommunikationsvetenskap och journalistik",
]

// Names and links to the different data portals
export const dataPortals: any = {
  "DiVA": "https://uu.diva-portal.org/",
  "Epsilon": "https://stud.epsilon.slu.se/"
};

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

  // Controlls wheter the submit button is disabled or not
  const [disableSubmit, setDisableSubmit] = useState(true as boolean);

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
  const [categoryArray, setCategoryArray] = useState([] as string[]);
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
  // Name of the author of the report
  const [authorName, setAuthorName] = useState("");
  // Contact information for the author of the report
  const [authorContact, setAuthorContact] = useState("");
  // The data portal where the report will be published
  const [dataPortal, setDataPortal] = useState("");

  // Message to the user if something goes wrong within the API. Yet to be fully implemented.
  const [message, setMessage] = useState("");

  /** Handles the submit of the form */
  const handleSubmit = async (e: any) => {
    // Prevents the page from sometimes reloading on submit, fixes a bug where the data wasn't always sent properly
    try { e.preventDefault() }
    catch { }

    try {
      if (disableSubmit) { throw new Error("Information saknas") }
      // Disables the submit button to prevent multiple submits
      setDisableSubmit(true);
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
          categorySwedish: !!categoryArray.join(", ") ? categoryArray.join(", ") : null,
          educationalProgram: !!program ? program == "addOrientation" ? setFirstLetterCapital(newProgram.toLowerCase()) : program : null,
          descriptionSwedish: !!description ? description : null,
          reportLink: !!reportLink ? reportLink : null,
          reportSite: !!dataPortal ? dataPortal : null,
          reportTitle: !!reportTitle ? reportTitle : null,
          videos: !!videos ? videos : null,
          pdfCase: !!caseDescription ? caseDescription : null,
          openData: !!openData ? openData : null,
          reportAuthor: !!authorName ? authorName : null,
          reportContact: !!authorContact ? authorContact : null,
          isEnergyStory: energyStory,
        }),
      });

      let resJson = await res.json();

      // If the post was successful, redirect to the home page
      if (res.status >= 200 && res.status < 300) {
        console.log(resJson)
        router.push("/" + window.location.search);
      }
      // If the post was not successful, display the error message
      else {
        setDisableSubmit(false);
        setMessage(resJson.message);
      }
    }
    catch (error) {
      setDisableSubmit(false);
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

  /** Gets all programs from the database, combines them with the base programs, and returns them as options in a select element */
  const getOrientation = () => {
    let programs: string[] = storiesData.map((pin: any) => pin.educationalProgram);
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
            <div key={category} className="display-flex align-items-center gap-50">
              <input
                type="checkbox"
                id={category}
                name={category}
                value={category}
                onClick={(e: any) => {
                  if (categoryArray.includes(e.target.value) && !e.target.checked) {
                    setCategoryArray(categoryArray.filter((item: any) => item !== e.target.value))
                  }
                  else if (!categoryArray.includes(e.target.value) && e.target.checked) {
                    setCategoryArray([...categoryArray, e.target.value])
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

  /** Gets all the data portals from 'dataPortals' and returns them as radio buttons */
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
                onChange={(e) => setDataPortal(e.target.value)}
              />
              <label htmlFor={portal}>{portal} </label>
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

  // Checks if all the required fields are filled in, and if they are, enables the submit button
  useEffect(() => {
    (!organisation || !projectTitle || !projectYear || !categoryArray.length || !lat || !lon) ? setDisableSubmit(true) : setDisableSubmit(false)
  }, [organisation, projectTitle, projectYear, categoryArray, lat, lon])

  return (
    <>
      <Head>
        <title>Lägg till story</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <Header />
      <div className="layout-main">
        <main className="margin-y-100">
          <h1 className="display-flex align-items-center gap-50">
            <LinkIcon src="/back.svg" alt="back" />
            Lägg till en ny story
          </h1>
          <form method="post" onSubmit={handleSubmit}>
            {/*Oraganisation section */}
            <label htmlFor="organisation">Organisation *</label>
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

            {/* Input field for adding a new organisation if addOrganisation is selected */}
            {organisation === "addOrganisation" && (
              <div>
                <label htmlFor="newOrganization">Ny organisation</label>
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
            <label htmlFor="program">Program</label>
            <select
              id="program"
              name="program"
              value={program}
              onChange={(e: any) => setProgram(e.target.value)}
            >
              <option value="">Välj program</option>
              {getOrientation()}
              <option value="addOrientation" label="Lägg till ny programinriktning" />
            </select>
            {/*Add new program */}
            {program === "addOrientation" ?
              <div>
                <label htmlFor={program}>Nytt program</label>
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

            {/*Title section */}
            <label htmlFor="title">Casetitel *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />

            {/*Report section */}
            <label htmlFor="name">Rapporttitel</label>
            <input
              type="text"
              id="name"
              name="name"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />

            {/* Selection of which data portal the report is/will be published on */}
            <strong>Dataportal där rapporten är/kommer vara</strong>
            {getDataPortals()}

            {/*Report link section */}
            <label htmlFor="reportLink">Länk till rapport</label>
            <input
              type="text"
              id="reportLink"
              name="reportLink"
              value={reportLink}
              onChange={(e) => setReportLink(e.target.value)}
            />

            {/*Start year section */}
            <label htmlFor="startYear">Startår *</label>
            <input
              type="number"
              id="startYear"
              name="startYear"
              value={projectYear}
              min={yearLimitsStories.min}
              onChange={(e) => setProjectYear(e.target.value)}
            />

            {/*Category section */}
            <strong>Kategorier *</strong>
            {getFilterdCategories()}


            {/*Location section */}
            <strong>Plats *</strong>
            <div className="display-flex align-items-center gap-50">
              <input
                id="switch-1"
                type="checkbox"
                onChange={(e) => setLocationToggle(e.target.checked)}
              />
              <label htmlFor="switch-1">Switch</label>
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

            {/*Description section */}
            <label htmlFor="description">Sammanfattning</label>
            <textarea
              id="description"
              name="description"
              maxLength={3000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <section className="grid-auto-rows">
              <div>
                {/*Link to case section */}
                <label htmlFor="caseDescription">Länk till case-beskrivning</label>
                <input type="text"
                  id="caseDescription"
                  name="caseDescription"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                />
              </div>

              <div>
                {/*External links section */}
                <label htmlFor="videos">Videolänk</label>
                <input type="text"
                  id="videos"
                  name="videos"
                  placeholder="Ex: https://www.youtube.com/embed/dQw4w9WgXcQ"
                  value={videos}
                  onChange={(e) => setVideos(e.target.value)}
                />
              </div>

              <div>
                {/*OpenData section */}
                <label htmlFor="openData">Länk till eventuell öppen data</label>
                <input type="text"
                  id="openData"
                  name="openData"
                  value={openData}
                  onChange={(e) => setOpenData(e.target.value)}
                />
              </div>
            </section>

            {/*Author section */}
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

            {/*isEnergyStory section */}
            <strong>Är det ett stories projekt?</strong>
            <div className="display-flex align-items-center gap-50">
              <input
                type="checkbox"
                id="energyStory"
                name="energyStory"
                value="energyStory"
                defaultChecked={energyStory}
                onChange={(e) => setEnergyStory(e.target.checked)}
              />
              <label htmlFor="energyStory" style={{ margin: 0 }}>
                {
                  energyStory === true ?
                    <span>Ja</span>
                    :
                    <span>Nej</span>
                }</label>
            </div>

            {/*Submit button section */}
            <input type="submit" onClick={handleSubmit} disabled={disableSubmit} value="Spara" /> {/*id={!disableSubmit ? styles.save : styles.disabled}*/}
            <div>{message ? <p>{message}</p> : null}</div>
          </form >
        </main>
      </div>

      {/* Footer */}
      <Footer />

    </>
  );
}