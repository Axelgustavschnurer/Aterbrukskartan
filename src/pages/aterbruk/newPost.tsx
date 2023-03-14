import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma, PrismaClient, Recycle, MapItem } from "@prisma/client";
import LeafletAddressLookup from "../../components/findAddress";
import styles from '../../styles/newPost.module.css';
import Image from "next/image";

// FIX: We have used both organisation and organization in the code. We should stick to one of them.

export default function AddNewPost() {
    const router = useRouter();
    const currentDate = new Date().getFullYear();

    const fetchData = async () => {
        const response = await fetch('http://localhost:3000/api/recycle')
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
    const [startYear, setStartYear] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [projectType, setProjectType] = useState("");
    const [location, setLocation] = useState("");
    const [searchingFor, setSearchingFor] = useState({
        "Stomme": false,
        "Inredning": false,
        "Småsaker": false,
        "Övrigt": false,

    });
    const [offering, setOffering] = useState({
        "Stomme": false,
        "Inredning": false,
        "Småsaker": false,
        "Övrigt": false,
    });
    const [description, setDescription] = useState("");
    const [contact, setContact] = useState("");
    const [externalLinks, setExternalLinks] = useState("");
    const [message, setMessage] = useState("");
    const [locationToggle, setLocationToggle] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            let mapItem: Prisma.MapItemCreateInput = {
                // FIX: We should not use ! here. We should check if lat and lon are defined before we use them.
                latitude: parseFloat(lat!),
                longitude: parseFloat(lon!),
                organisation: organization,
                year: parseInt(startYear),
            }
            // Gets the keys of the searchingFor object and returns them as a string
            let lookingForMaterials: string = (() => {
                let materials: string[] = [];
                for (let key in searchingFor) {
                    if (searchingFor[key as keyof (typeof searchingFor)]) {
                        materials.push(key);
                    }
                }
                return materials.join(", ");
            })();
            // Gets the keys of the offering object and returns them as a string
            let availableMaterials: string = (() => {
                let materials: string[] = [];
                for (let key in offering) {
                    if (offering[key as keyof (typeof offering)]) {
                        materials.push(key);
                    }
                }
                return materials.join(", ");
            })();

            // Sends a post request to the api with the data from the form
            let res = await fetch("http://localhost:3000/api/recycle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    projectType,
                    mapItem,
                    month: startMonth ? parseInt(startMonth) : undefined,
                    lookingForMaterials,
                    availableMaterials,
                    description,
                    contact,
                    externalLinks
                }),
            });

            let resJson = await res.json();
            if (res.status >= 200 && res.status < 300) {
                // If the post was successful, reset the form and redirect to the home page
                setOrganization("");
                setStartYear("");
                setProjectType("");
                setLocation("");
                setLat(undefined);
                setLon(undefined);
                setSearchingFor({
                    "Stomme": false,
                    "Inredning": false,
                    "Småsaker": false,
                    "Övrigt": false,
                });
                setOffering({
                    "Stomme": false,
                    "Inredning": false,
                    "Småsaker": false,
                    "Övrigt": false,
                });
                setDescription("");
                setContact("");
                setExternalLinks("");
                setLocationToggle(false);
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

    const projectTypes = () => {
        let categories = [
            "Rivning",
            "Nybyggnation",
            "Ombyggnation",
        ]
        return (
            <>
                {categories.map((category: any, index: any) => {
                    return (
                        <div className={styles.typeInputGroup} key={category}>
                            <input
                                type="radio"
                                id={category}
                                name="category"
                                value={category}
                                onChange={(e) => setProjectType(e.target.value)}
                            />
                            <label htmlFor={category}>{category} </label>
                        </div>
                    )
                }
                )}
            </>
        )
    }

    const offers = () => {
        let categories = [
            "Stomme",
            "Inredning",
            "Småsaker",
            "Övrigt",
        ]
        return (
            <>
                {categories.map((category: any, index: any) => {
                    return (
                        <div className={styles.inputGroup} key={"_" + category}>
                            <input
                                type="checkbox"
                                id={"_" + category}
                                name={category}
                                value={category}
                                onChange={setOfferings}
                            />
                            <label htmlFor={"_" + category}>{category}</label>
                        </div>
                    )
                })}
            </>
        )
    }

    const searchingFors = () => {
        let categories = [
            "Stomme",
            "Inredning",
            "Småsaker",
            "Övrigt",
        ]
        return (
            <>
                {categories.map((category: any, index: any) => {
                    return (
                        <div className={styles.inputGroup} key={category}>
                            <input
                                type="checkbox"
                                id={category}
                                name={category}
                                value={category}
                                onChange={setSearching}
                            />
                            <label htmlFor={category}>{category}</label>
                        </div>
                    )
                })}
            </>
        )
    }


    // sets the state of the searchingFor object
    const setSearching = (e: any) => {
        setSearchingFor({
            ...searchingFor,
            [e.target.name]: e.target.checked,
        })
    }

    // sets the state of the offering object
    const setOfferings = (e: any) => {
        setOffering({
            ...offering,
            [e.target.name]: e.target.checked,
        })
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
                                    required
                                >
                                    <option value="">Välj organisation</option>
                                    {getOrganisation()}

                                </select>
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

                            <div className={styles.startMonth}>
                                <h3>Startmånad</h3>
                                <select
                                    id="startMonth"
                                    name="startMonth"
                                    value={startMonth}
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
                            <div className={styles.optionList}>
                                <div className={styles.form}>
                                    <h3>Typ av projekt</h3>
                                    {projectTypes()}
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
                                    rows={10}
                                    maxLength={3000}
                                    placeholder="Hur mycket (Ex. mått och vikt) och kort om skicket på produkten."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div >
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