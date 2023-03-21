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

// FIX: We have used both organisation and organization in the code. We should stick to one of them.

export default function EditStory() {
  const router = useRouter();
  const currentDate = new Date().getFullYear();

  // Declares the filter variable and its setter function
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

  const [modalState, setModalState] = useState(false);

  const [newData, setNewData] = useState([{}] as DeepStory[]);
  const [filterData, setFilterData] = useState({} as DeepStory);

  const [project, setProject] = useState("");
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

  // Fetches all data from the database
  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/stories')
    const data = await response.json()
    setNewData(data)
  }

  // Runs fetchData function on component mount
  useEffect(() => {
    fetchData()
  }, [])


  // Fetches the data with a specific id from the database
  const fetchFilterData = async (id: any) => {
    const response = await fetch('http://localhost:3000/api/stories?id=' + id)
    const data: DeepStory = await response.json()
    console.log(data)
    setFilterData(data)
  }

  useEffect(() => {
    fetchFilterData(project)
  }, [project])

  useEffect(() => {
    setLat(filterData.mapItem?.latitude as any)
    setLon(filterData.mapItem?.longitude as any)
    setProgram(filterData.educationalProgram?.split(", ")[0] as any)
    setProgramOrientation(filterData.educationalProgram?.split(", ")[1] as any)
    setCategorys(filterData.categorySwedish?.toLowerCase().split(", ") as string[] || [] as string[])
    setReportTitle(filterData.reportTitle as any)
    setReportLink(filterData.reports as any)
    setVideos(filterData.videos as any)
    setCaseDescription(filterData.pdfCase as any)
    setDescription(filterData.descriptionSwedish as any)
  }, [filterData])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // TODO: implement address, postcode and city
      let mapItem: Prisma.MapItemCreateInput = {
        latitude: lat ? parseFloat(lat) : undefined,
        longitude: lon ? parseFloat(lon) : undefined,
        address: "" ? "" : undefined,
        postcode: parseInt("") ? parseInt("") : undefined,
        city: "" ? "" : undefined,
        organisation: organization ? organization : undefined,
        year: parseInt(startYear) ? parseInt(startYear) : undefined,
        name: title ? title : undefined,
      }
      // Gets the keys of the searchingFor object and returns them as a strin
      // Sends a post request to the api with the data from the form
      let res = await fetch("http://localhost:3000/api/stories?id=" + project, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mapItem,
          categorySwedish: categorys.length ? categorys.join(", ") : null,
          educationalProgram: programOrientation ? (program + ", " + programOrientation) : program ? program : null,
          descriptionSwedish: description === filterData.descriptionSwedish ? undefined : description ? description : null,
          reports: reportLink === filterData.reports ? undefined : reportLink ? reportLink : null,
          reportTitle: reportTitle === filterData.reportTitle ? undefined : reportTitle ? reportTitle : null,
          videos: videos === filterData.videos ? undefined : videos ? videos : null,
          pdfCase: caseDescription === filterData.pdfCase ? undefined : caseDescription ? caseDescription : null,
          isEnergyStory: energyStory,
        }),
      });

      console.log(JSON.stringify({
        mapItem,
        categorySwedish: categorys.length ? categorys.join(", ") : null,
        educationalProgram: programOrientation ? (program + ", " + programOrientation) : program ? program : null,
        descriptionSwedish: description === filterData.descriptionSwedish ? undefined : description ? description : null,
        reports: reportLink === filterData.reports ? undefined : reportLink ? reportLink : null,
        reportTitle: reportTitle === filterData.reportTitle ? undefined : reportTitle ? reportTitle : null,
        videos: videos === filterData.videos ? undefined : videos ? videos : null,
        pdfCase: caseDescription === filterData.pdfCase ? undefined : caseDescription ? caseDescription : null,
        isEnergyStory: energyStory,
      })
      );


      let resJson = await res.json();
      if (res.status >= 200 && res.status < 300) {
        // If the post was successful, reset the form and redirect to the home page
        setOrganization("");
        setStartYear("");
        setLat(undefined);
        setLon(undefined);
        setDescription("");
        setLocationToggle(false);
        router.push("/stories");
      } else {
        setMessage(resJson.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (e: any) => {
    e.preventDefault();
    try {
      // Sends a post request to the api with the data from the form
      let res = await fetch("http://localhost:3000/api/stories?id=" + project, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let resJson = await res.json();
      console.log(resJson)
      if (res.status >= 200 && res.status < 300) {
        // If the post was successful, reset the form and redirect to the home page
        router.push("/stories");
      } else {
        setMessage(resJson.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteModalOnclick = () => {
    setModalState(!modalState)
  }

  const NewPostMap = React.useMemo(() => dynamic(
    () => import('../../components/newPostMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [/* list variables which should trigger a re-render here */])

  // gets all the organisations from the database and returns them as options in a select element
  // const getOrganisation = () => {
  //     let mappedData = newData.map((pin: any) => pin.mapItem.organisation)
  //     let filteredData = mappedData.filter((pin: any, index: any) => mappedData.indexOf(pin) === index).sort()
  //     return (
  //         <>
  //             {filteredData.map((pin: any, index: any) => {
  //                 return (
  //                     <option key={pin} value={pin}>{pin}</option>
  //                 )
  //             })}
  //         </>
  //     )
  // }

  const getProject = () => {
    let mappedData = newData.map((pin: any) => pin)
    return (
      <>
        {mappedData.map((pin: any, index: any) => {
          return (
            <option key={index} value={pin.id}>{pin.id}: {pin.mapItem?.organisation}: {pin.mapItem?.name}, {pin.mapItem?.year} </option>
          )
        })}
      </>
    )
  }

  // gets all the categories from the database and returns them as checkboxes
  const getAllCategories = () => {
    let unsplitMaterials: string[] = [];
    newData.map((pin: any) => {
      if (pin.categorySwedish) {
        unsplitMaterials.push(pin.categorySwedish)
      }
    })

    let splitMaterials: string[] = [];
    unsplitMaterials.map((category: any) => {
      splitMaterials.push(...category.split(", ").map((item: any) => item.trim().toLowerCase()))
    })
    let filteredCategories = splitMaterials.filter((data: any, index: any) => splitMaterials.indexOf(data) === index && data).sort()

    return filteredCategories
  }

  const getFilterdCategories = () => {
    let categories = getAllCategories();
    return (
      <>
        {categories.map((category: any, index: any) => {
          return (
            <div className={styles.typeInputGroup} key={index}>
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
        }
        )}
      </>
    )
  }

  const getEducationalPrograms = () => {
    let programs = educationalPrograms;
    return (
      <>
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
          <h1 className={styles.addNewPostTitle}>Lägg till en ny story</h1>
          <div className={styles.addNewPostForm}>
            <form method="post" onSubmit={handleSubmit}>
              <div className={styles.addNewPostFormSelect}>
                <h3>Välj projekt</h3>
                <select
                  id="project"
                  name="project"
                  defaultValue={filterData?.id}
                  onChange={(e) => setProject(e.target.value)}
                >
                  <option value="">Välj projekt</option>
                  {getProject()}
                </select>
              </div>
              <div className={styles.addNewPostFormSelect}>
                <h3>Organisation *</h3>
                {/*
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
                  <option defaultValue={filterData.mapItem?.organisation ? filterData.mapItem?.organisation : undefined}>{filterData.mapItem?.organisation}</option>
                </select>
              </div>
              <div className={styles.addNewPostFormSelect}>
                <h3>Program *</h3>
                <select
                  id="program"
                  name="program"
                  // value={program}
                  onChange={(e: any) => setProgram(e.target.value)}
                >
                  <option defaultValue={program}>{!program ? "Välj program" : program}</option>
                  {getEducationalPrograms()}
                </select>
              </div>
              {
                program === "Agronom" || program === "Civilingenjör" || program === "Högskoleingenjör" || program === "Kandidatprogram" ?
                  <div className={styles.addNewPostFormOrientation}>
                    <h3>Programinriktning *</h3>
                    <input
                      type="text"
                      key={program}
                      id={program}
                      name={program}
                      defaultValue={programOrientation}
                      onChange={(e) => setProgramOrientation(e.target.value)}
                    />
                  </div>
                  :
                  null

              }

              <div className={styles.addNewPostFormTitle}>
                <h3>Titel</h3>
                <input
                  type="text"
                  id="title"
                  name="title"
                  // value={title}
                  defaultValue={filterData.mapItem?.name ? filterData.mapItem?.name : undefined}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className={styles.addNewPostFormName}>
                <h3>Rapportnamn</h3>
                <input
                  type="text"
                  id="name"
                  name="name"
                  // value={reportTitle}
                  defaultValue={filterData.reportTitle ? filterData.reportTitle : undefined}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>
              <div className={styles.addNewPostFormName}>
                <h3>Länk till rapport</h3>
                <input
                  type="text"
                  id="reportLink"
                  name="reportLink"
                  // value={reportLink}
                  defaultValue={filterData.reports ? filterData.reports : undefined}
                  onChange={(e) => setReportLink(e.target.value)}
                />
              </div>
              <div className={styles.startYear}>
                <h3>Startår</h3>
                <input
                  type="number"
                  id="startYear"
                  name="startYear"
                  // value={startYear}
                  defaultValue={filterData.mapItem?.year ? filterData.mapItem?.year : undefined}
                  min={2014}
                  onChange={(e) => setStartYear(e.target.value)}
                />
              </div>
              <div className={styles.addNewPostForm}>
                <h3>Kategorier</h3>
                <div className={styles.optionList}>
                  <div className={styles.form}>
                    {getFilterdCategories()}
                  </div>
                </div>
              </div>
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
                        defaultLat={filterData.mapItem.latitude}
                        defaultLon={filterData.mapItem.longitude}
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
              <div className={styles.addNewPostFormDescription}>
                <h3 style={{ marginTop: "10px" }}>Beskrivning *</h3>
                <textarea
                  id="description"
                  name="description"
                  rows={10}
                  maxLength={3000}
                  // value={description}
                  defaultValue={filterData.descriptionSwedish ? filterData.descriptionSwedish : undefined}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div >
              <div className={styles.addNewPostFormContact}>
                <h3>Länk till case-beskrivning *</h3>
                <textarea
                  id="caseDescription"
                  name="caseDescription"
                  rows={1}
                  cols={100}
                  defaultValue={filterData.pdfCase ? filterData.pdfCase : undefined}
                  onChange={(e) => setCaseDescription(e.target.value)}
                />
              </div >
              <div className={styles.addNewPostFormExternalLinks}>
                <h3>Videolänk</h3>
                <textarea
                  id="videos"
                  name="videos"
                  rows={1}
                  cols={100}
                  defaultValue={filterData.videos ? filterData.videos : undefined}
                  onChange={(e) => setVideos(e.target.value)}
                />
              </div >
              <div className={styles.energyStory}>
                <h3>Är det en energy story?</h3>
                <input
                  type="checkbox"
                  id="energyStory"
                  name="energyStory"
                  value="energyStory"
                  defaultChecked={filterData.isEnergyStory ? filterData.isEnergyStory : false}
                  onChange={(e) => setEnergyStory(e.target.checked)}
                />
                {
                  energyStory === true ?
                    <p>Ja</p>
                    :
                    <p>Nej</p>
                }
              </div>
            </form>
            <div className={styles.btnAlignContainer}>
              <div className={styles.addNewPostFormSubmit}>
                <button id={styles.save} type="submit" onClick={handleSubmit}> Spara </button>
              </div>
              <div className={styles.addNewPostFormSubmit}>
                <button id={styles.remove} onClick={handleDeleteModalOnclick}> Ta bort </button>
                <Modal toggle={modalState} action={handleDeleteModalOnclick} handleDelete={handleDelete} />
              </div>
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
  );
}