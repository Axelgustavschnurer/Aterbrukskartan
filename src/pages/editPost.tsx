import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Prisma, PrismaClient, Recycle, MapItem } from "@prisma/client";
import LeafletAddressLookup from "../components/findAddress";
import styles from '../styles/editPost.module.css'


export default function EditPost() {
    let currentDate = new Date().getFullYear();
    const router = useRouter();

    const fetchData = async () => {
        const response = await fetch('http://localhost:3000/api/getData')
        const data = await response.json()
        setNewData(data)
    }

    // Runs fetchData function on component mount
    useEffect(() => {
        fetchData()
    }, [])

    const [newData, setNewData] = useState([]);


    const [lat, setLat] = useState();
    const [lon, setLon] = useState();

    const [location, setLocation] = useState('');
    const [locationToggle, setLocationToggle] = useState(false);


    const NewPostMap = React.useMemo(() => dynamic(
        () => import('../components/newPostMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [/* list variables which should trigger a re-render here */])

    const handleSubmit = async (e: any) => { }

    return (
        <>
            <Head>
                <title>Återbrukskartan</title>
                <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
            </Head>
            <div className={styles.header} id={styles.header}>
                <img src="/images/stuns_logo.png" alt="logo" />
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
                                    value={1}
                                    // onChange={(e) => setOrganization(e.target.value)}
                                    required
                                >
                                    <option value="">Välj organisation</option>
                                    {/* {getOrganisation()} */}

                                </select>
                            </div>
                            <div className={styles.startYear}>
                                <h3>Startår</h3>
                                <input
                                    type="number"
                                    id="startYear"
                                    name="startYear"
                                    value={""}
                                    min={currentDate}
                                // onChange={(e) => setStartYear(e.target.value)}
                                />
                            </div>

                            <div className={styles.startMonth}>
                                <h3>Startmånad</h3>
                                <select
                                    id="startMonth"
                                    name="startMonth"
                                    value={""}
                                // onChange={(e) => setStartMonth(e.target.value)}
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
                                    <div className={styles.typeInputGroup}>
                                        <input
                                            type="radio"
                                            id="rivning"
                                            name="category"
                                            value="Rivning"
                                        // onChange={(e) => setProjectType(e.target.value)}
                                        />
                                        <label htmlFor="rivning">Rivning </label>
                                    </div>
                                    <div className={styles.typeInputGroup}>
                                        <input
                                            type="radio"
                                            id="nybyggnation"
                                            name="category"
                                            value="Nybyggnation"
                                        // onChange={(e) => setProjectType(e.target.value)}
                                        />
                                        <label htmlFor="nybyggnation">Nybyggnation </label>
                                    </div>
                                    <div className={styles.typeInputGroup}>
                                        <input
                                            type="radio"
                                            id="ombyggnation"
                                            name="category"
                                            value="Ombyggnation"
                                        // onChange={(e) => setProjectType(e.target.value)}
                                        />
                                        <label htmlFor="ombyggnation">Ombyggnation</label>
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
                                    // onChange={(e) => setLocationToggle(e.target.checked)}
                                    />
                                    {/* If you want to switch to map, uncomment this part*/}
                                    {/* <label htmlFor="switch-1" className={styles.switch-label">Switch</label> */}
                                </div>
                                {
                                    locationToggle === true ?
                                        <>
                                            <NewPostMap />
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={location}
                                                placeholder="Klistra in koordinater här"
                                                // onChange={(e) => setLocation(e.target.value)}
                                                required
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
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="checkbox"
                                            id="_stomme"
                                            name="Stomme"
                                            value="Stomme"
                                        // onChange={setOfferings}
                                        />
                                        <label htmlFor="_stomme">Stomme</label>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="checkbox"
                                            id="_inredning"
                                            name="Inredning"
                                            value="Inredning"
                                        // onChange={setOfferings}
                                        />
                                        <label htmlFor="_inredning">Inredning</label>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="checkbox"
                                            id="_smasaker"
                                            name="Småsaker"
                                            value="Småsaker"
                                        // onChange={setOfferings}
                                        />
                                        <label htmlFor="_smasaker">Småsaker</label>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="checkbox"
                                            id="_ovrigt"
                                            name="Övrigt"
                                            value="Övrigt"
                                        // onChange={setOfferings}
                                        />
                                        <label htmlFor="_ovrigt">Övrigt</label>
                                    </div>
                                </div>

                                <div className={styles.form}>
                                    <h3>Sökes</h3>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="checkbox"
                                            id="stomme"
                                            name="Stomme"
                                            value="Stomme"
                                        // onChange={setSearching}
                                        />
                                        <label htmlFor="stomme">Stomme</label>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="checkbox"
                                            id="inredning"
                                            name="Inredning"
                                            value="Inredning"
                                        // onChange={setSearching}
                                        />
                                        <label htmlFor="inredning">Inredning</label>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="checkbox"
                                            id="smasaker"
                                            name="Småsaker"
                                            value="Småsaker"
                                        // onChange={setSearching}
                                        />
                                        <label htmlFor="smasaker">Småsaker</label>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="checkbox"
                                            id="ovrigt"
                                            name="Övrigt"
                                            value="Övrigt"
                                        // onChange={setSearching}
                                        />
                                        <label htmlFor="ovrigt">Övrigt</label>
                                    </div>
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
                                    value={""}
                                    // onChange={(e) => setDescription(e.target.value)}
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
                                    value={""}
                                    // onChange={(e) => setContact(e.target.value)}
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
                                    value={""}
                                // onChange={(e) => setExternalLinks(e.target.value)}
                                />
                            </div >
                            <div className={styles.addNewPostFormSubmit}>
                                < button type="submit" > Spara</button >
                            </div >
                            {/* <div className={styles.message}>{message ? <p>{message}</p> : null}</div> */}
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
    )
}