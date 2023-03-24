import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import LeafletAddressLookup from "@/components/findAddress";
import styles from '@/styles/editPost.module.css'
import { DeepRecycle } from "@/types";
import { yearLimitsRecycle } from ".";
import Image from "next/image";
import Modal from '@/components/deleteModal';
import { categories, projectTypes } from "./newPost";
import { Button } from "@nextui-org/react";

/** Array of objects containing the values and labels for the month dropdown */
export const monthOptionArray = [
  { value: "", label: "Välj startmånad" },
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Mars" },
  { value: "4", label: "April" },
  { value: "5", label: "Maj" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Augusti" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

/** Returns the month options for the month dropdown */
export const monthOptions = () => {
  return (
    <>
      {monthOptionArray.map((month: any) => {
        return (
          <option key={month.label} value={month.value} label={month.label} />
        )
      })}
    </>
  )
};

export default function EditPost() {
  // All recycle data from the database
  const [recycleData, setRecycleData] = useState([] as DeepRecycle[]);
  // ID of the currently selected project, used when calling fetchRecycleObject
  const [project, setProject] = useState("");
  // Data for the currently selected project
  const [selectedRecycleObject, setSelectedRecycleObject] = useState({} as DeepRecycle);

  // State for the delete modal
  const [modalState, setModalState] = useState(false);

  // State for the location toggle
  // false = use address lookup
  // true = use map
  const [locationToggle, setLocationToggle] = useState(false);

  // Form data
  const [organisation, setOrganisation] = useState("");
  const [startYear, setStartYear] = useState(undefined as string | undefined);
  const [startMonth, setStartMonth] = useState("");
  const [projectType, setProjectType] = useState("");
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [available, setAvailableMaterials] = useState([] as string[]);
  const [searchingFor, setSearchingFor] = useState([] as string[]);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [externalLinks, setExternalLinks] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  /** Fetches all recycle data from the database */
  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/recycle')
    const data = await response.json()
    setRecycleData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  /** Fetches the recycle object with a specific id from the database */
  const fetchRecycleObject = async (id: any) => {
    const response = await fetch('http://localhost:3000/api/recycle?id=' + id)
    const data: DeepRecycle = await response.json()
    console.log(data)
    setSelectedRecycleObject(data)
  }

  // Runs fetchRecycleObject function whenever a project is selected
  useEffect(() => {
    fetchRecycleObject(project)
  }, [project])

  // Sets the state variables to the values of the selected recycle object, whenever project selection changes
  useEffect(() => {
    setLat(selectedRecycleObject.mapItem?.latitude as any)
    setLon(selectedRecycleObject.mapItem?.longitude as any)
    setOrganisation(selectedRecycleObject.mapItem?.organisation ? selectedRecycleObject.mapItem?.organisation : "")
    setStartYear(selectedRecycleObject.mapItem?.year ? selectedRecycleObject.mapItem?.year.toString() : undefined)
    setStartMonth(selectedRecycleObject.month ? selectedRecycleObject.month.toString() : "")
    setProjectType(selectedRecycleObject.projectType ? selectedRecycleObject.projectType : "")
    setAvailableMaterials(selectedRecycleObject.availableMaterials ? selectedRecycleObject.availableMaterials.split(", ") as string[] : [] as string[])
    setSearchingFor(selectedRecycleObject.lookingForMaterials ? selectedRecycleObject.lookingForMaterials.split(", ") as string[] : [] as string[])
    setDescription(selectedRecycleObject.description ? selectedRecycleObject.description : "")
    setContact(selectedRecycleObject.contact ? selectedRecycleObject.contact : "")
    setExternalLinks(selectedRecycleObject.externalLinks ? selectedRecycleObject.externalLinks : "")
  }, [selectedRecycleObject])

  /** A map component used as an alternative to the address lookup */
  const NewPostMap = React.useMemo(() => dynamic(
    () => import('../../components/newPostMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  /** Handles the submit event */
  const handleSubmit = async (e: any) => {
    try {
      /** The data that is sent to the database */
      const data = {
        projectType: !!projectType ? projectType : null,
        description: !!description ? description : null,
        lookingForMaterials: searchingFor.length ? searchingFor.join(", ") : null,
        availableMaterials: available.length ? available.join(", ") : null,
        month: !!startMonth ? parseInt(startMonth) : null,
        contact: !!contact ? contact : null,
        externalLinks: !!externalLinks ? externalLinks : null,
        mapItem: {
          // TODO: Allow these to be null if the user removes them
          organisation: !!organisation ? organisation : null,
          year: !!startYear ? parseInt(startYear) : null,
          latitude: !!lat ? parseFloat(lat) : null,
          longitude: !!lon ? parseFloat(lon) : null,
        }
      }
      console.log(data)

      // Update the data in the database with a PUT request
      const response = await fetch(('http://localhost:3000/api/recycle?id=' + project), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      console.log(result)

      // If the response is successful, the user is redirected to the aterbruk page, else an error is logged
      if (response.status >= 200 && response.status < 300) {
        router.push('/aterbruk')
      }
      else {
        setMessage(result.message);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (e: any) => {
    e.preventDefault();
    try {
      // Sends a DELETE request to the database to mark the selected project as deleted
      const response = await fetch(('http://localhost:3000/api/recycle?id=' + project), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      console.log(result);

      // If the response is successful, the user is redirected to the aterbruk page else an error is logged
      if (response.status >= 200 && response.status < 300) {
        router.push('/aterbruk')
      }
      // TODO: Show message from the API if the request fails
    }
    catch (error) {
      console.log(error)
    }
  }

  /** Handles the state of the modal */
  const handleDeleteModalOnclick = () => {
    setModalState(!modalState)
  }

  const organisationOptions = () => {
    let mappedData = recycleData.map((pin: any) => pin.mapItem.organisation)
    let filteredData = mappedData.filter((organisation: any, index: any) => mappedData.indexOf(organisation) === index && !!organisation).sort()
    return (
      <>
        {filteredData.map((pin: any) => {
          return (
            <option key={pin} value={pin} label={pin} />
          )
        })}
        <option value="" label="Välj organisation" />
      </>
    )
  }

  /** Gets the project id from the database */
  const getProject = () => {
    let mappedData = recycleData.map((pin: any) => pin)
    return (
      <>
        {mappedData.map((pin: any, index: any) => {
          return (
            <option key={pin.id} value={pin.id}>{pin.id}: {pin.mapItem?.organisation}, {pin.mapItem?.year}</option>
          )
        })}
      </>
    )
  }

  /** Creates radio buttons for the project types */
  const projectTypeSelector = () => {
    return (
      <>
        {/* Loops through the list and creates an input for each item in the list*/}
        {projectTypes.map((category: any, index: any) => {
          return (
            <div className={styles.typeInputGroup} key={category}>
              <input
                type="radio"
                id={category}
                name="category"
                value={category}
                checked={projectType === category}
                onChange={(e) => setProjectType(e.target.value)}
              />
              <label htmlFor={category}>{category} </label>
            </div>
          )
        })}
      </>
    )
  }

  /** Gets all the categories defined in the imported list `categories`, and returns them as a list of checkboxes for the availableMaterials field */
  const offers = () => {
    return (
      <>
        {categories.map((category: any) => {
          return (
            <div className={styles.inputGroup} key={"_" + category}>
              <input
                type="checkbox"
                id={"_" + category}
                name={category}
                value={category}
                checked={available.includes(category)}
                onChange={(e: any) => {
                  if (available.includes(e.target.value) && !e.target.checked) {
                    setAvailableMaterials(available.filter((item: any) => item !== e.target.value))
                  }

                  else if (!available.includes(e.target.value) && e.target.checked) {
                    setAvailableMaterials([...available, e.target.value])
                  }
                  console.log(available);

                }}
              />
              <label htmlFor={"_" + category}>{category}</label>
            </div>
          )
        })}
      </>
    )
  }

  /** Gets all the categories defined in the imported list `categories`, and returns them as a list of checkboxes for the lookingForMaterials field */
  const searchingFors = () => {
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
                checked={searchingFor.includes(category)}
                onChange={(e: any) => {
                  if (searchingFor.includes(e.target.value) && !e.target.checked) {
                    setSearchingFor(searchingFor.filter((item: any) => item !== e.target.value))
                  }

                  else if (!searchingFor.includes(e.target.value) && e.target.checked) {
                    setSearchingFor([...searchingFor, e.target.value])
                  }
                  console.log(searchingFor);
                }}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          )
        })}
      </>
    )
  }


  return (
    <>
      <Head>
        <title>Redigera inlägg</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <div className={styles.header} id={styles.header}>
        <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
      </div>

      <div className={styles.addPostContainer}>
        <div className={styles.addNewPostContainer}>
          <h1 className={styles.addNewPostTitle}>Redigera ett inlägg</h1>
          <div className={styles.addNewPostForm}>
            <form method="put" onSubmit={handleSubmit}>
              <div className={styles.addNewPostFormSelect}>
                <h3>Välj projekt</h3>
                <select
                  id="project"
                  name="project"
                  value={project ?? ''}
                  onChange={(e) => setProject(e.target.value)}
                >
                  <option value="">Välj projekt</option>
                  {getProject()}
                </select>
              </div>

              <div className={styles.addNewPostFormSelect}>
                <h3>Organisation *</h3>
                <select
                  id="organization"
                  name="organization"
                  value={organisation ?? ''}
                  onChange={(e) => setOrganisation(e.target.value)}
                >
                  {organisationOptions()}
                </select>
              </div>

              <div className={styles.startYear}>
                <h3>Startår</h3>
                <input
                  type="number"
                  id="startYear"
                  name="startYear"
                  value={startYear ?? ''}
                  min={yearLimitsRecycle.min}
                  onChange={(e) => setStartYear(e.target.value)}
                />
              </div>

              <div className={styles.startMonth}>
                <h3>Startmånad</h3>
                <select
                  id="startMonth"
                  name="startMonth"
                  value={monthOptionArray.find((option) => option.value === startMonth)?.value}
                  onChange={(e) => setStartMonth(e.target.value)}
                >
                  {monthOptions()}
                </select>
              </div>

              <div className={styles.optionList}>
                <div className={styles.form}>
                  <h3>Typ av projekt</h3>
                  {projectTypeSelector()}
                </div>
              </div>

              <div className={styles.addNewPostFormLocation}>
                <h3>Plats *</h3>
                { // The map switch is hidden if no project is selected (by checking if mapItem exists)
                  !!selectedRecycleObject.mapItem &&
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
                        defaultLat={selectedRecycleObject.mapItem?.latitude || 59.8586}
                        defaultLon={selectedRecycleObject.mapItem?.longitude || 17.6389}
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

              <div className={styles.optionList}>
                <div className={styles.form}>
                  <h3>Erbjuds</h3>
                  {offers()}
                </div>

                <div className={styles.form}>
                  <h3>Sökes</h3>
                  {searchingFors()}
                </div>
              </div>

              <div className={styles.addNewPostFormDescription}>
                <h3>Beskrivning *</h3>
                <textarea
                  id="description"
                  name="description"
                  maxLength={3000}
                  placeholder="Hur mycket (Ex. mått och vikt) och kort om skicket på produkten."
                  value={description ?? ''}
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                />
              </div >

              <div className={styles.addNewPostFormContact}>
                <h3>Kontakt *</h3>
                <textarea
                  id="contact"
                  name="contact"
                  value={contact ?? ''}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className={styles.addNewPostFormExternalLinks}>
                <h3>Länkar</h3>
                <textarea
                  id="externalLinks"
                  name="externalLinks"
                  value={externalLinks ?? ''}
                  onChange={(e) => setExternalLinks(e.target.value)}
                />
              </div >
              <div className={styles.message}>{message ? <p>{message}</p> : null}</div>
            </form >

            <div className={styles.btnAlignContainer}>
              <div className={styles.addNewPostFormSubmit}>
                < Button id={styles.save} type="submit" onClick={handleSubmit}> Spara </Button >
              </div >

              <div className={styles.addNewPostFormSubmit}>
                <Button id={styles.remove} onClick={handleDeleteModalOnclick}> Ta bort </Button >
                <Modal toggle={modalState} action={handleDeleteModalOnclick} handleDelete={handleDelete} />
              </div >
            </div>
          </div >
        </div >
      </div >

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
  )
}