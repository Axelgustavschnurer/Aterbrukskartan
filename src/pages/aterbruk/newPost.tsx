import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma, PrismaClient, Recycle, MapItem } from "@prisma/client";
import LeafletAddressLookup from "@/components/findAddress";
import styles from '@/styles/newPost.module.css';
import Image from "next/image";

// FIX: We have used both organisation and organization in the code. We should stick to one of them.

export const categories = [
  "Stomme",
  "Inredning",
  "Småsaker",
  "Övrigt",
];

export const projectTypes = [
  "Rivning",
  "Nybyggnation",
  "Ombyggnation",
];

export default function AddNewPost() {
  const router = useRouter();
  const currentDate = new Date().getFullYear();

  // Toggles the location input between a map and a text input with address lookup
  const [locationToggle, setLocationToggle] = useState(false);

  // Data from the database
  const [recycleData, setRecycleData] = useState([]);

  // Coordinates
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

  const [organization, setOrganization] = useState("");
  const [projectStartYear, setStartYear] = useState("");
  const [projectStartMonth, setStartMonth] = useState("");
  const [projectType, setProjectType] = useState("");
  const [searchingFor, setSearchingFor] = useState([] as string[]);
  const [offering, setOffering] = useState([] as string[]);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [externalLinks, setExternalLinks] = useState("");
  const [message, setMessage] = useState("");

  /** Fetches data from the api */
  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/recycle')
    const data = await response.json()
    setRecycleData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Creates a mapItem object from the form data
      let mapItem: Prisma.MapItemCreateInput = {
        latitude: lat ? parseFloat(lat) : null,
        longitude: lon ? parseFloat(lon) : null,
        organisation: organization,
        year: parseInt(projectStartYear),
      }

      // Sends a post request to the api with the data from the form
      let res = await fetch("http://localhost:3000/api/recycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 
        body: JSON.stringify({
          projectType,
          mapItem,
          month: projectStartMonth ? parseInt(projectStartMonth) : undefined,
          lookingForMaterials: searchingFor.length > 0 ? searchingFor.join(", ") : undefined,
          availableMaterials: offering.length > 0 ? offering.join(", ") : undefined,
          description,
          contact,
          externalLinks
        }),
      });

      let resJson = await res.json();
      if (res.status >= 200 && res.status < 300) {
        // If the post was successful, reset the form and redirect to the home page
        console.log(resJson)
        router.push("/aterbruk");
      } else {
        setMessage(resJson.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const NewPostMap = React.useMemo(() => dynamic(
    () => import('../../components/newPostMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  /** Gets all the organisations from the database and returns them as options in a select element */
  const getOrganisation = () => {
    let mappedData = recycleData.map((pin: any) => pin.mapItem.organisation)
    let filteredData = mappedData.filter((pin: any, index: any) => mappedData.indexOf(pin) === index).sort()
    return (
      <>
        {filteredData.map((pin: any) => {
          return (
            <option key={pin} value={pin}>{pin}</option>
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
            <div className={styles.typeInputGroup} key={type}>
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
            <div className={styles.inputGroup} key={"_" + category}>
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
            <div className={styles.inputGroup} key={category}>
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

  return (
    <>
      <Head>
        <title>Lägg till inlägg</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <div className={styles.header} id={styles.header}>
        <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
      </div>

      <div className={styles.addPostContainer}>
        <div className={styles.addNewPostContainer}>
          <h1 className={styles.addNewPostTitle}>Lägg till ett inlägg</h1>
          <div className={styles.addNewPostForm}>
            <form method="post" onSubmit={handleSubmit}>
              {/* Organisation selection */}
              <div className={styles.addNewPostFormSelect}>
                <h3>Organisation *</h3>
                {/* if you want to use the text input instead of the select, comment out the select and uncomment the text input
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
                  required
                >
                  <option value="">Välj organisation</option>
                  {getOrganisation()}
                </select>
              </div>

              {/* Year selection */}
              <div className={styles.startYear}>
                <h3>Startår</h3>
                <input
                  type="number"
                  id="startYear"
                  name="startYear"
                  value={projectStartYear}
                  min={currentDate}
                  onChange={(e) => setStartYear(e.target.value)}
                />
              </div>

              {/* Month selection */}
              <div className={styles.startMonth}>
                <h3>Startmånad</h3>
                <select
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
              </div>

              {/* Project type selection */}
              <div className={styles.optionList}>
                <div className={styles.form}>
                  <h3>Typ av projekt</h3>
                  {projectTypeSelector()}
                </div>
              </div>

              {/* Position selection */}
              <div className={styles.addNewPostFormLocation}>
                <h3>Plats *</h3>
                <div className={styles.switch}>
                  <input
                    id="switch-1"
                    type="checkbox"
                    className={styles.switchInput}
                    onChange={(e) => setLocationToggle(e.target.checked)}
                  />
                  {/* A toggle for switching between the map and the address lookup */}
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

              {/* Offered and wanted material selection */}
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

              {/* Description */}
              <div className={styles.addNewPostFormDescription}>
                <h3>Beskrivning *</h3>
                <textarea
                  id="description"
                  name="description"
                  rows={10}
                  maxLength={3000}
                  placeholder="Hur mycket (Ex. mått och vikt) och kort om skicket på produkten."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div >

              {/* Contact */}
              <div className={styles.addNewPostFormContact}>
                <h3>Kontakt *</h3>
                <textarea
                  id="contact"
                  name="contact"
                  rows={3}
                  cols={100}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div >

              {/* External links */}
              <div className={styles.addNewPostFormExternalLinks}>
                <h3>Länkar</h3>
                <textarea
                  id="externalLinks"
                  name="externalLinks"
                  rows={1}
                  cols={100}
                  value={externalLinks}
                  onChange={(e) => setExternalLinks(e.target.value)}
                />
              </div >

              {/* Submit button */}
              <div className={styles.addNewPostFormSubmit}>
                < button type="submit" > Spara</button >
              </div >

              <div className={styles.message}>{message ? <p>{message}</p> : null}</div>
            </form >
          </div >
        </div >
      </div >

      <div className={styles.footer} id={styles.footer}>
        <div className={styles.footerContainer}>
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