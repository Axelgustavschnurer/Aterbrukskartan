import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma } from "@prisma/client";
import LeafletAddressLookup from "@/components/findAddress";
import { yearLimitsRecycle } from ".";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "@/session";
import LinkIcon from "@/components/buttons/backButton";

// TODO: We have used both organisation and organization in the code. We should stick to one of them.

/**
 * These are the categories listed in a "Miljöinventering" document in Uppsala, plus "Övrigt".
 * "Golv" is actually called "Invändig golvbeläggning" in the document, but we shortened it to "Golv".
 * We also changed "Grundläggning" to "Fyllnadsmaterial".
 */
export const categories = [
  "Fasad",
  "Fast inredning",
  "Fyllnadsmaterial",
  "Fönster",
  "Golv",
  "Installationer",
  "Stomme",
  "Tak",
  "Övrigt"
];

export const projectTypes = [
  "Demontering",
  "Nybyggnation",
  "Ombyggnation",
  "Mellanlagring",
];

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

export default function AddNewPost({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  // Controlls wheter the submit button is disabled or not
  const [disableSubmit, setDisableSubmit] = useState(true as boolean);

  // Toggles the location input between a map and a text input with address lookup
  const [locationToggle, setLocationToggle] = useState(false);

  // Data from the database
  const [recycleData, setRecycleData] = useState([]);

  // Coordinates
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

  // Form data
  const [organization, setOrganization] = useState("");
  const [newOrganization, setNewOrganization] = useState("");
  const [projectStartYear, setStartYear] = useState("");
  const [projectStartMonth, setStartMonth] = useState("");
  const [projectEndYear, setEndYear] = useState("");
  const [projectEndMonth, setEndMonth] = useState("");
  const [projectType, setProjectType] = useState("");
  const [searchingFor, setSearchingFor] = useState([] as string[]);
  const [offering, setOffering] = useState([] as string[]);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [externalLinks, setExternalLinks] = useState("");
  const [fileObject, setFileObject] = useState(null as File | null);
  const [isPublic, setIsPublic] = useState(false as boolean);

  // Extra data regarding the file
  const [fileName, setFileName] = useState(null as string | null);
  const [fileContent, setFileContent] = useState(null as Buffer | null);

  // Error message
  const [message, setMessage] = useState("");

  /** Fetches data from the api */
  const fetchData = async () => {
    const response = await fetch('/api/recycle')
    const data = await response.json()
    setRecycleData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  /** Sets fileContent and fileName when a file is uploaded */
  useEffect(() => {
    if (fileObject) {
      setFileName(fileObject.name)
      // Converts the file to an ArrayBuffer and then to a Buffer
      // Buffers can be sent as JSON to the API, where they are converted to Buffer objects again, which Prisma can handle
      fileObject.arrayBuffer().then((buffer: ArrayBuffer) => {
        let fileBuffer = Buffer.from(buffer)
        if (fileBuffer.byteLength > 1048576) {
          alert("Filen är för stor, max 1 MB. Vänligen välj en mindre fil eller komprimera den till en zip-fil.")
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

  const handleSubmit = async (e: any) => {
    // Prevents the page from sometimes reloading on submit, fixes a bug where the data wasn't always sent properly
    try { e.preventDefault(); }
    catch { }

    try {
      if (disableSubmit) throw new Error("Information saknas");
      setDisableSubmit(true);

      // If user has selected "Lägg till en organisation", connect the new organisation to the user
      if (organization === "addOrganisation" && newOrganization) {
        fetch(window.location.origin + '/api/userCreateAndConnectOrg', {
          method: 'POST',
          mode: 'same-origin',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newOrganization,
          }),
        }).catch((error) => {
          console.log(error)
        })
      }

      // Creates a mapItem object from the form data
      let mapItem: Prisma.MapItemCreateInput = {
        latitude: lat ? parseFloat(lat) : null,
        longitude: lon ? parseFloat(lon) : null,
        organisation: !!organization && organization != "addOrganisation" ? organization : !!newOrganization ? newOrganization : null,
        year: parseInt(projectStartYear),
      }

      let res = await fetch(window.location.origin + '/api/recycle', {
        method: 'POST',
        mode: 'same-origin',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectType,
          mapItem,
          month: projectStartMonth ? parseInt(projectStartMonth) : undefined,
          endYear: projectEndYear ? parseInt(projectEndYear) : undefined,
          endMonth: projectEndMonth ? parseInt(projectEndMonth) : undefined,
          lookingForMaterials: searchingFor.length > 0 ? searchingFor.join(", ") : undefined,
          availableMaterials: offering.length > 0 ? offering.join(", ") : undefined,
          description,
          contact,
          externalLinks,
          attachment: fileContent,
          attachmentName: fileName ? fileName : undefined,
          isPublic,
        }),
      })

      let resJson = await res.json()

      if (res.status >= 200 && res.status < 300) {
        // If the post was successful, reset the form and redirect to the home page
        console.log(resJson)
        router.push("/aterbruk" + window.location.search);
      } else {
        setDisableSubmit(false);
        setMessage(resJson.message);
      }
    } catch (error) {
      setDisableSubmit(false);
      console.log(error)
    }
  }

  // Dynamically imports the map component, which is only rendered on the client side. This is done to prevent the map from being rendered on the server side, which would cause an hydration error.
  const NewPostMap = React.useMemo(() => dynamic(
    () => import('../../components/newPostMap'),
    {
      loading: () => <p>A map is loading</p>, // TODO: Fix proper loading animation
      ssr: false
    }
  ), [])

  /** Gets all the organisations from the database and returns them as options in a select element */
  const getOrganisation = () => {
    const orgs = user?.recycleOrganisations
    if (!orgs) return null
    return (
      <>
        {orgs.map((org: any) => {
          return (
            <option key={org} value={org}>{org}</option>
          )
        })}
      </>
    )
  }

  /** Gets all the project types from the database and returns them as radio buttons */
  const projectTypeSelector = () => {
    return (
      <>
        {projectTypes.map((type: any) => {
          return (
            <div className="display-flex align-items-center gap-50" key={type}>
              <input
                type="radio"
                id={type}
                name="category"
                value={type}
                onChange={(e) => setProjectType(e.target.value)}
              />
              <label htmlFor={type}>{type} </label>
            </div>
          )
        })}
      </>
    )
  }

  /** Gets all the categories defined at the start of this file and returns them as checkboxes for the availableMaterials field */
  const offers = () => {
    return (
      <>
        {categories.map((category: any) => {
          return (
            <div className="display-flex align-items-center gap-50" key={"_" + category}>
              <input
                type="checkbox"
                id={"_" + category}
                name={category}
                value={category}
                onChange={(e: any) => {
                  // If the checkbox is checked and the value is not already in the array, add it
                  if (e.target.checked && !offering.includes(e.target.value)) {
                    setOffering([...offering, e.target.value])
                  }
                  // Otherwise, remove it from the array
                  else if (!e.target.checked) {
                    setOffering(offering.filter((item: string) => item !== e.target.value))
                  }
                }}
              />
              <label htmlFor={"_" + category}>{category}</label>
            </div>
          )
        })}
      </>
    )
  }

  /** Gets all the categories defined at the start of this file and returns them as checkboxes for the lookingForMaterials field */
  const searchingFors = () => {
    return (
      <>
        {categories.map((category: any) => {
          return (
            <div className="display-flex align-items-center gap-50" key={category}>
              <input
                type="checkbox"
                id={category}
                name={category}
                value={category}
                onChange={(e: any) => {
                  // If the checkbox is checked and the value is not already in the array, add it
                  if (e.target.checked && !searchingFor.includes(e.target.value)) {
                    setSearchingFor([...searchingFor, e.target.value])
                  }
                  // Otherwise, remove it from the array
                  else if (!e.target.checked) {
                    setSearchingFor(searchingFor.filter((item: string) => item !== e.target.value))
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

  // Checks if all the required fields are filled in, and if they are, enables the submit button
  useEffect(() => {
    (!organization || !projectType || !contact || !description || !lat || !lon) ? setDisableSubmit(true) : setDisableSubmit(false)
  }, [organization, projectType, contact, description, lat, lon, setDisableSubmit])

  return (
    <>
      <Head>
        <title>Lägg till inlägg</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <div className="container-text" style={{marginInline: 'auto'}}>
        <main className="margin-block-100">

          <h1 className="display-flex align-items-center gap-50">
            <LinkIcon src="/back.svg" alt="back" />
            Lägg till ett inlägg
          </h1>

          <form method="post" onSubmit={handleSubmit}>
            {/* Organisation selection */}
            <label className="block margin-block-75">
              Organisation *
              <select
                className="block margin-block-25"
                id="organization"
                name="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
              >
                <option value="">Välj organisation</option>
                {getOrganisation()}
                {user?.isAdmin &&
                  <option key="addOrganisation" value="addOrganisation">Lägg till en organisation</option>
                }
              </select>
            </label>

            {organization === "addOrganisation" && (
              <>
                <label className="block margin-block-75">
                  Ny organisation
                  <input
                    className="margin-block-25"
                    type="text"
                    key="newOrganization"
                    id="newOrganization"
                    name="newOrganization"
                    value={newOrganization}
                    onChange={(e) => setNewOrganization(e.target.value)}
                  />
                </label>
              </>
            )
            }

            {/* Year selection */}
            <section className="grid-auto-rows">
              <label className="block margin-block-75">
                Startår
                <input
                  className="margin-block-25"
                  type="number"
                  id="startYear"
                  name="startYear"
                  value={projectStartYear}
                  min={yearLimitsRecycle.min}
                  onChange={(e) => setStartYear(e.target.value)}
                />
              </label>

              <label className="block margin-block-75">
                Startmånad
                <select
                  className="block margin-block-25"
                  id="startMonth"
                  name="startMonth"
                  value={projectStartMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                >
                  <option value="">Välj startmånad</option>
                  <option value={1}>Januari</option>
                  <option value={2}>Februari</option>
                  <option value={3}>Mars</option>
                  <option value={4}>April</option>
                  <option value={5}>Maj</option>
                  <option value={6}>Juni</option>
                  <option value={7}>Juli</option>
                  <option value={8}>Augusti</option>
                  <option value={9}>September</option>
                  <option value={10}>Oktober</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </label>
            </section>

            {/* Month selection */}
            {/* TODO: Import monthOptionArray from editPost and do this like how it's done there */}
            <section className="grid-auto-rows">

              {/* End year selection */}
              <label className="block margin-block-75">
                Slutår
                <input
                  className="block margin-block-25"
                  type="number"
                  id="endYear"
                  name="endYear"
                  value={projectEndYear}
                  min={yearLimitsRecycle.min}
                  onChange={(e) => setEndYear(e.target.value)}
                />
              </label>

              {/* End month selection */}
              <label className="block margin-block-75">
                Slutmånad
                <select
                  className="block margin-block-25"
                  id="endMonth"
                  name="endMonth"
                  value={projectEndMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                >
                  <option value="">Välj slutmånad</option>
                  <option value={1}>Januari</option>
                  <option value={2}>Februari</option>
                  <option value={3}>Mars</option>
                  <option value={4}>April</option>
                  <option value={5}>Maj</option>
                  <option value={6}>Juni</option>
                  <option value={7}>Juli</option>
                  <option value={8}>Augusti</option>
                  <option value={9}>September</option>
                  <option value={10}>Oktober</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </label>
            </section>

            {/* Project type selection */}
            <fieldset className="margin-block-75">
              <legend>Typ av projekt *</legend>
              {projectTypeSelector()}
            </fieldset>

            {/* Position selection */}
            <fieldset>
              <legend className="display-flex align-items-center gap-50">
                Plats *
                <label className="switch" style={{ width: "60px" }}>
                  <input
                    id="switch-1"
                    type="checkbox"
                    onChange={(e) => setLocationToggle(e.target.checked)}
                  />
                  <span className="slider round" style={{ margin: "unset" }}></span>
                  {/* A toggle for switching between the map and the address lookup */}
                </label>
              </legend>

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
            </fieldset>

            {/* Offered and wanted material selection */}
            <div className="flex gap-50 flex-wrap-wrap margin-block-100">
              <fieldset className="flex-grow-100">
                <legend>Erbjuds</legend>
                {offers()}
              </fieldset>
              <fieldset className="flex-grow-100">
                <legend>Sökes</legend>
                {searchingFors()}
              </fieldset>
            </div>

            {/* Description */}
            <label className="block margin-block-75">
              Beskrivning *
              <textarea
                className="margin-block-25"
                style={{ resize: 'vertical', width: '100%' }}
                id="description"
                name="description"
                maxLength={3000}
                placeholder="Hur mycket (Ex. mått och vikt) och kort om skicket på produkten."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>

            {/* Contact */}
            <label className="block margin-block-75">
              Kontakt *
              <textarea
                className="margin-block-25"
                style={{ resize: 'vertical', width: '100%' }}
                id="contact"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </label>

            {/* External links */}
            <label className="block margin-block-75">
              Länkar
              <textarea
                className="margin-block-25"
                style={{ resize: 'vertical', width: '100%' }}
                id="externalLinks"
                name="externalLinks"
                placeholder="https://www.example.com"
                value={externalLinks}
                onChange={(e) => setExternalLinks(e.target.value)}
              />
            </label>

            {/* Attachments */}
            {/* TODO: Fil borde tas bort automatiskt om den är för stor */}
            <fieldset className="margin-block-75" style={{padding: '0', border: '0'}}>
              <label>
                Dra och släpp, eller bläddra bland filer
                <input type="file" name="file" id="fileUpload" className="margin-top-25" onChange={(e) => e.target.files ? setFileObject(e.target.files[0]) : setFileObject(null)} />
              </label>
              <small>Alla filformat accepteras, inklusive bilder och dokument. Maximal filstorlek är 2 MB. Du kan också ladda upp zip-filer för att underlätta nedladdning av flera filer samtidigt.</small>
              

              <button className="block margin-block-75" type="button" id="removeFileButton" onClick={() => {
                let fileInput = document.querySelector("input[type=file]") as HTMLInputElement;
                let container = new DataTransfer();
                fileInput.files = container.files;
                setFileObject(null)
              }}>
                Ta bort fil
              </button>
            </fieldset>

            {/* Publicity setting */}
            <fieldset className="margin-block-75">
              <legend>Ska det här projektet visas för alla på Återbrukskartan?</legend>
              <label className="display-flex align-items-center gap-50">
                <input
                  type="radio"
                  id="isPublicTrue"
                  name="isPublic"
                  value="true"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(true)}
                />
                Ja
              </label>
              <label className="display-flex align-items-center gap-50">
                <input
                  type="radio"
                  id="isPublicFalse"
                  name="isPublic"
                  value="false"
                  checked={!isPublic}
                  onChange={(e) => setIsPublic(false)}
                />
                Nej
              </label>
            </fieldset>

            {/* Submit button */}
            <input disabled={disableSubmit} id={!disableSubmit ? "save" : "disabled"} type="submit" onClick={handleSubmit} value="Spara" className="margin-block-75" />

            <div>{message ? <p>{message}</p> : null}</div>
          </form >
        </main>
      </div>
    </>
  );
}