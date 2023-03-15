import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma, PrismaClient, Recycle, MapItem } from "@prisma/client";
import LeafletAddressLookup from "@/components/findAddress";
import styles from '@/styles/newStory.module.css';
import Image from "next/image";

// FIX: We have used both organisation and organization in the code. We should stick to one of them.

export default function AddNewStory() {
    const router = useRouter();
    const currentDate = new Date().getFullYear();

    const fetchData = async () => {
        const response = await fetch('http://localhost:3000/api/stories')
        const data = await response.json()
        setNewData(data)
    }

    // Runs fetchData function on component mount
    useEffect(() => {
        fetchData()
    }, [])


    // Declares the filter variable and its setter function
    const [lat, setLat] = useState();
    const [lon, setLon] = useState();

    const [newData, setNewData] = useState([]);

    const [organization, setOrganization] = useState("");

    const [program, setProgram] = useState("");
    const [programOrientation, setProgramOrientation] = useState("");
    const [joinProgram, setJoinProgram] = useState("");

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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            let mapItem: Prisma.MapItemCreateInput = {
                // FIX: We should not use ! here. We should check if lat and lon are defined before we use them.
                latitude: parseFloat(lat!),
                longitude: parseFloat(lon!),
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

    const NewPostMap = React.useMemo(() => dynamic(
        () => import('../../components/newPostMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [/* list variables which should trigger a re-render here */])

    // gets all the organisations from the database and returns them as options in a select element
    const getOrganisation = () => {
        let mappedData = newData.map((pin: any) => pin.mapItem.organisation)
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
        let programs = ["Agronom", "Aivilingenjör", "Högskoleingenjör", "Handidatprogram"];
        ;
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
                            <div className={styles.addNewPostFormOrganization}>
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
                                    <option value="">Välj organisation</option>
                                    {getOrganisation()}

                                </select>
                            </div>
                            <div className={styles.addNewPostFormOrganization}>
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
                            <div className={styles.startYear}>
                                <h3>Startår</h3>
                                <input
                                    type="number"
                                    id="startYear"
                                    name="startYear"
                                    value={startYear}
                                    min={currentDate}
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
                                    value={description}
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
                                    value={caseDescription}
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
                                    value={videos}
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
                            <div className={styles.addNewPostFormSubmit}>
                                < button type="submit" > Spara</button >
                            </div >
                            <div className={styles.message}>{message ? <p>{message}</p> : null}</div>
                        </form >
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