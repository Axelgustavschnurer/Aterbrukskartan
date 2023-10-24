import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import LeafletAddressLookup from "@/components/findAddress";
import { DeepRecycle } from "@/types";
import { yearLimitsRecycle } from ".";
import Image from "next/image";
import Modal, { DangerousModal } from '@/components/deleteModal';
import { categories, projectTypes } from "./newPost";
import { getSession } from "@/session";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import LinkIcon from "@/components/linkIcon";

/** Array of objects containing the values and labels for the month dropdown */
export const monthOptionArray = [
  { value: "", label: "Välj månad" },
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

// Get user data from session
export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const { user } = await getSession(req, res)

  if (!user) {
    return {
      props: {
        user: null
      }
    }
  }

  return {
    props: {
      user: user
    }
  }
}

export default function EditPost({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
  const [newOrganisation, setNewOrganisation] = useState("");
  const [startYear, setStartYear] = useState(undefined as string | undefined);
  const [startMonth, setStartMonth] = useState("");
  const [endYear, setEndYear] = useState(undefined as string | undefined);
  const [endMonth, setEndMonth] = useState("");
  const [projectType, setProjectType] = useState("");
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [available, setAvailableMaterials] = useState([] as string[]);
  const [searchingFor, setSearchingFor] = useState([] as string[]);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [externalLinks, setExternalLinks] = useState("");
  const [isPublic, setIsPublic] = useState(false as boolean);
  const [fileObject, setFileObject] = useState(null as File | null);
  const [message, setMessage] = useState("");

  // Extra data regarding the file
  const [fileName, setFileName] = useState(null as string | null);
  const [fileContent, setFileContent] = useState(null as Buffer | null);

  const router = useRouter();

  // Runs fetchData function on component mount
  useEffect(() => {
    /** Fetches all recycle data from the database */
    const fetchData = async () => {
      const response = await fetch('/api/recycle')
      let data: DeepRecycle[] = await response.json()

      // Removes all objects the user does not have access to edit
      // This should probably have been done in the API, but I guess it's fine since the information is kinda public and stuff marked private gets filtered in the API anyway
      if (!user?.isAdmin) {
        data = data.filter((item: DeepRecycle) => {
          return user?.recycleOrganisations?.includes(item.mapItem?.organisation!)
        })
      }
      setRecycleData(data)
    }

    fetchData()
  }, [user])

  /** Fetches the recycle object with a specific id from the database */
  const fetchRecycleObject = async (id: any) => {
    const response = await fetch('/api/recycle?id=' + id)
    const data: DeepRecycle = await response.json()
    // Creates a proper Buffer from the (stringified) attachment data
    data.attachment = data.attachment ? Buffer.from(data.attachment) : null;
    setSelectedRecycleObject(data)
  }

  /** Sets fileContent and fileName when a file is uploaded */
  useEffect(() => {
    if (fileObject) {
      setFileName(fileObject.name)
      // Converts the file to an ArrayBuffer and then to a Buffer
      // Buffers can be sent as JSON to the API, where they are converted to Buffer objects again, which Prisma can handle
      fileObject.arrayBuffer().then((buffer: ArrayBuffer) => {
        let fileBuffer = Buffer.from(buffer)
        // If the file is larger than 1 MB, the file is removed and the user is notified
        if (fileBuffer.byteLength > 1048576) {
          let fileInput = document.querySelector("input[type=file]") as HTMLInputElement;
          let container = new DataTransfer();
          fileInput.files = container.files;
          alert("Filen är för stor, max 1 MB. Ingen fil är vald nu, klicka på \"Ladda upp en fil\" igen för att välja en ny fil eller \"Återställ ursprunglig fil\" för att återställa den ursprungliga filen.")
          setFileObject(null)
          setFileName(null)
          setFileContent(null)
          return
        }
        setFileContent(fileBuffer)
      })
    } else {
      setFileName(null)
      setFileContent(null)
    }
  }, [fileObject])

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
    setEndYear(selectedRecycleObject.endYear ? selectedRecycleObject.endYear.toString() : undefined)
    setEndMonth(selectedRecycleObject.endMonth ? selectedRecycleObject.endMonth.toString() : "")
    setProjectType(selectedRecycleObject.projectType ? selectedRecycleObject.projectType : "")
    setAvailableMaterials(selectedRecycleObject.availableMaterials ? selectedRecycleObject.availableMaterials.split(", ") as string[] : [] as string[])
    setSearchingFor(selectedRecycleObject.lookingForMaterials ? selectedRecycleObject.lookingForMaterials.split(", ") as string[] : [] as string[])
    setDescription(selectedRecycleObject.description ? selectedRecycleObject.description : "")
    setContact(selectedRecycleObject.contact ? selectedRecycleObject.contact : "")
    setExternalLinks(selectedRecycleObject.externalLinks ? selectedRecycleObject.externalLinks : "")
    if (selectedRecycleObject.attachment) {
      let file = new File([selectedRecycleObject.attachment], selectedRecycleObject.attachmentName || "Unknown")
      setFileObject(selectedRecycleObject.attachment ? new File([selectedRecycleObject.attachment], selectedRecycleObject.attachmentName || "Unknown") : null)
      // Set the file of the file input element to the file object
      let fileInput = document.querySelector("input[type=file]") as HTMLInputElement;
      // DataTransfer is used to create a new FileList object, which is then assigned to the file input element
      let container = new DataTransfer();
      container.items.add(file);
      fileInput.files = container.files;
    } else {
      setFileObject(null)
    }
    setIsPublic(selectedRecycleObject.isPublic ? selectedRecycleObject.isPublic : false)
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
    // Prevents the page from sometimes reloading on submit, fixes a bug where the data wasn't always sent properly
    try { e.preventDefault() }
    catch { }

    try {
      // If user has selected "Lägg till en organisation", connect the new organisation to the user
      if (organisation === "addOrganisation" && newOrganisation) {
        fetch(window.location.origin + '/api/userCreateAndConnectOrg', {
          method: 'POST',
          mode: 'same-origin',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newOrganisation,
          }),
        }).catch((error) => {
          console.log(error)
        })
      }

      /** The data that is sent to the database */
      const data = {
        projectType: !!projectType ? projectType : null,
        description: !!description ? description : null,
        lookingForMaterials: searchingFor.length ? searchingFor.join(", ") : null,
        availableMaterials: available.length ? available.join(", ") : null,
        month: !!startMonth ? parseInt(startMonth) : null,
        endYear: !!endYear ? parseInt(endYear) : null,
        endMonth: !!endMonth ? parseInt(endMonth) : null,
        contact: !!contact ? contact : null,
        externalLinks: !!externalLinks ? externalLinks : null,
        attachment: fileContent,
        attachmentName: fileName ? fileName : null,
        isPublic: isPublic,
        isActive: true,
        mapItem: {
          organisation: !!organisation && organisation != "addOrganisation" ? organisation : !!newOrganisation ? newOrganisation : null,
          year: !!startYear ? parseInt(startYear) : null,
          latitude: !!lat ? parseFloat(lat) : null,
          longitude: !!lon ? parseFloat(lon) : null,
          isActive: true,
        }
      }
      console.log(data)

      // Update the data in the database with a PUT request
      const response = await fetch(('/api/recycle?id=' + project), {
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
        router.push('/aterbruk' + window.location.search)
      }
      else {
        setMessage(result.message);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  /** Handles the delete event */
  const handleDelete = async (e: any) => {
    // Prevents the page from sometimes reloading on submit, fixes a bug where the data wasn't always sent properly
    try { e.preventDefault() }
    catch { }

    try {
      // Sends a DELETE request to the database to mark the selected project as deleted
      const response = await fetch(('/api/recycle?id=' + project), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      console.log(result);

      // If the response is successful, the user is redirected to the aterbruk page else an error is logged
      if (response.status >= 200 && response.status < 300) {
        router.push('/aterbruk' + window.location.search)
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

  /** Dropdown menu for organisation selection */
  const organisationOptions = () => {
    let mappedData = recycleData.map((pin: any) => pin.mapItem.organisation)
    // Filters out duplicate organisations and sorts them alphabetically. Also removes organisations that the user doesn't have access to.
    let filteredData = mappedData.filter((organisation: any, index: any) => mappedData.indexOf(organisation) === index && !!organisation && (user?.isAdmin || user?.recycleOrganisations?.includes(organisation))).sort()
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
            <div key={category} className="display-flex align-items-center gap-50">
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
            <div key={"_" + category} className="display-flex align-items-center gap-50">
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
            <div key={category} className="display-flex align-items-center gap-50">
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

      <div className="layout-main">
        <div id="header">
          <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
        </div>
        <main>
          <LinkIcon href='/' src="/back.svg" alt="back" />

          <h1>Redigera ett inlägg</h1>
          <form method="put" onSubmit={handleSubmit}>
            <label htmlFor="project">Välj projekt</label>
            <select
              id="project"
              name="project"
              value={project ?? ''}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="">Välj projekt</option>
              {getProject()}
            </select>

            <label htmlFor="organisation">Organisation</label>
            <select
              id="organisation"
              name="organisation"
              value={organisation ?? ''}
              onChange={(e) => setOrganisation(e.target.value)}
            >
              {organisationOptions()}
              <option key="addOrganisation" value="addOrganisation">Lägg till en organisation</option>
            </select>

            {organisation === "addOrganisation" && (
              <div>
                <label htmlFor="newOrganisation">Ny organisation</label>
                <input
                  type="text"
                  key="newOrganisation"
                  id="newOrganisation"
                  name="newOrganisation"
                  value={newOrganisation}
                  onChange={(e) => setNewOrganisation(e.target.value)}
                />
              </div>
            )
            }

            <section className="grid-auto-rows">
              <div>
                <label htmlFor="startYear">Startår</label>
                <input
                  type="number"
                  id="startYear"
                  name="startYear"
                  value={startYear ?? ''}
                  min={yearLimitsRecycle.min}
                  onChange={(e) => setStartYear(e.target.value)}
                />
              </div>

              {/* End year selection */}
              <div>
                <label htmlFor="endYear">Slutår</label>
                <input
                  type="number"
                  id="endYear"
                  name="endYear"
                  value={endYear ?? ''}
                  min={yearLimitsRecycle.min}
                  onChange={(e) => setEndYear(e.target.value)}
                />
              </div>
            </section>

            <section className="grid-auto-rows">
              <div>
                <label htmlFor="startMonth">Startmånad</label>
                <select
                  id="startMonth"
                  name="startMonth"
                  value={monthOptionArray.find((option) => option.value === startMonth)?.value}
                  onChange={(e) => setStartMonth(e.target.value)}
                >
                  {monthOptions()}
                </select>
              </div>

              {/* End month selection */}
              <div>
                <label htmlFor="endMonth">Slutmånad</label>
                <select
                  id="endMonth"
                  name="endMonth"
                  value={monthOptionArray.find((option) => option.value === endMonth)?.value}
                  onChange={(e) => setEndMonth(e.target.value)}
                >
                  {monthOptions()}
                </select>
              </div>
            </section>

            <strong>Typ av projekt</strong>
            {projectTypeSelector()}

            <strong>Plats</strong>
            { // The map switch is hidden if no project is selected (by checking if mapItem exists)
              !!selectedRecycleObject.mapItem &&
              <div className="display-flex align-items-center gap-50">
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

            <strong>Erbjuds</strong>
            {offers()}

            <strong>Sökes</strong>
            {searchingFors()}


            <label htmlFor="description">Beskrivning</label>
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

            <label htmlFor="contact">Kontakt</label>
            <textarea
              id="contact"
              name="contact"
              value={contact ?? ''}
              onChange={(e) => setContact(e.target.value)}
            />

            <label htmlFor="externalLinks">Länkar</label>
            <textarea
              id="externalLinks"
              name="externalLinks"
              value={externalLinks ?? ''}
              onChange={(e) => setExternalLinks(e.target.value)}
            />
            <div>{message ? <p>{message}</p> : null}</div>

            {/* Attachments */}
            <label htmlFor="uploadFile" style={{ display: "block" }}><strong>Dra och släpp, eller bläddra bland filer</strong></label>
            <input type="file" id="uploadFile" name="file" onChange={(e) => e.target.files ? setFileObject(e.target.files[0]) : setFileObject(null)} />

            <button id="removeFileButton" className="danger" onClick={() => {
              let fileInput = document.querySelector("input[type=file]") as HTMLInputElement;
              let container = new DataTransfer();
              fileInput.files = container.files;
              setFileObject(null)
            }}>
              Ta bort fil
            </button>
            {  // If the project has an attachment, show a button to reset the file input element to the file from the database
              selectedRecycleObject.attachment &&
              <button id="resetFileButton" className="danger" onClick={() => {
                let fileInput = document.querySelector("input[type=file]") as HTMLInputElement;
                let container = new DataTransfer();
                let file = new File([selectedRecycleObject.attachment!], selectedRecycleObject.attachmentName || "Unknown")
                container.items.add(file);
                fileInput.files = container.files;
                setFileObject(file)
              }}>
                Återställ ursprunglig fil
              </button>
            }

            {/* Publicity setting */}

            <strong>Ska det här projektet visas för alla på Återbrukskartan?</strong>
            <div className="display-flex align-items-center gap-50">
              <input
                type="radio"
                id="isPublicTrue"
                name="isPublic"
                value="true"
                checked={isPublic ?? false}
                onChange={(e) => setIsPublic(true)}
              />
              <label htmlFor="isPublicTrue">Ja</label>
            </div>
            <div className="display-flex align-items-center gap-50">
              <input
                type="radio"
                id="isPublicFalse"
                name="isPublic"
                value="false"
                checked={!isPublic ?? false}
                onChange={(e) => setIsPublic(false)}
              />
              <label htmlFor="isPublicFalse">Nej</label>
            </div>

            <div className="display-flex gap-50">
              { // If the project is active, show a save button, else show a restore button
                selectedRecycleObject.isActive === true ?
                  <button id="save" type="submit" onClick={handleSubmit}> Spara </button >
                  :
                  <button id="restore" type="submit" onClick={handleSubmit}> Spara och Återställ </button >
              }

              { // If  the selected project is inactive, show a dangerous delete button, else show a button to deactivate the project
                // In practice, the dangerous delete button will only be shown if the user is an admin and the API will reject the dangerous delete request if the user is not an admin
                selectedRecycleObject.isActive === false ?
                  <div>
                    <button id="remove" className="danger" onClick={handleDeleteModalOnclick}> Ta bort inlägg</button >
                    <DangerousModal toggle={modalState} cancel={handleDeleteModalOnclick} delete={handleDelete} />
                  </div>
                  :
                  <div>
                    <button id="remove" className="danger" onClick={handleDeleteModalOnclick}> Ta bort inlägg</button >
                    <Modal toggle={modalState} action={handleDeleteModalOnclick} handleDelete={handleDelete} />
                  </div>
              }
            </div>
          </form >

        </main>

        <a href="https://stuns.se/" target="_blank" rel="noreferrer">
          STUNS
        </a>
      </div>
    </>
  )
}