import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState } from "react";
import Head from "next/head";
import { Prisma, PrismaClient, Recycle, MapItem } from "@prisma/client";

// FIX: We have used both organisation and organization in the code. We should stick to one of them.

export default function AddNewPost() {
    const router = useRouter();
    const currentDate = new Date().getFullYear();


    // Declares the filter variable and its setter function
    const [organization, setOrganization] = useState("");
    const [startYear, setStartYear] = useState("");
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            let mapItem: Prisma.MapItemCreateInput = {
                latitude: parseFloat(location.split(", ")[0]),
                longitude: parseFloat(location.split(", ")[1]),
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
            let res = await fetch("http://localhost:3000/api/postData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    projectType,
                    mapItem,
                    lookingForMaterials,
                    availableMaterials,
                    description,
                    contact,
                    externalLinks
                }),
            });
            let resJson = await res.json();
            if (res.status === 200) {
                // If the post was successful, reset the form and redirect to the home page
                setOrganization("");
                setProjectType("");
                setLocation("");
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
                router.push("/");
            } else {
                setMessage("Something went wrong")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const NewPostMap = React.useMemo(() => dynamic(
        () => import('../components/newPostMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [/* list variables which should trigger a re-render here */])

    return (
        <>
            <Head>
                <title>Återbrukskartan</title>
                <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
            </Head>
            <div className="header" id="header">
                <img src="/images/stuns_logo.png" alt="logo" />
            </div>
            <div className="addPostContainer">
                <div className="addNewPostContainer">
                    <div className="addNewPostTitle">
                        <h1>Lägg till ett inlägg</h1>
                    </div>
                    <div className="addNewPostForm">
                        <form method="post" onSubmit={handleSubmit}>
                            <div className="addNewPostFormOrganization">
                                <label className="newPostTitle" htmlFor="organization">Organisation *</label>
                                <input
                                    type="text"
                                    id="organization"
                                    name="organization"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="startYear">
                                <label className="newPostTitle" htmlFor="startYear">Startår *</label>
                                <input
                                    type="number"
                                    id="startYear"
                                    name="startYear"
                                    value={startYear}
                                    min={currentDate}
                                    onChange={(e) => setStartYear(e.target.value)}
                                />
                            </div>
                            <div className="typeOfProject">
                                <label className="newPostTitle" htmlFor="type">Typ av projekt</label>
                                <div className="padding">
                                    <input
                                        type="radio"
                                        id="rivning"
                                        name="category"
                                        value="Rivning"
                                        onChange={(e) => setProjectType(e.target.value)}
                                    />
                                    <label htmlFor="rivning">Rivning </label>
                                </div>
                                <div className="padding">
                                    <input
                                        type="radio"
                                        id="nybyggnation"
                                        name="category"
                                        value="Nybyggnation"
                                        onChange={(e) => setProjectType(e.target.value)}
                                    />
                                    <label htmlFor="nybyggnation">Nybyggnation </label>
                                </div>
                                <div className="padding">
                                    <input
                                        type="radio"
                                        id="ombyggnation"
                                        name="category"
                                        value="Ombyggnation"
                                        onChange={(e) => setProjectType(e.target.value)}
                                    />
                                    <label htmlFor="ombyggnation">Ombyggnation</label>
                                </div>
                            </div>
                            <div className="addNewPostFormLocation">
                                <label className="newPostTitle" htmlFor="location">Plats *</label>
                                <NewPostMap />
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={location}
                                    placeholder="Klistra in koordinater här"
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="addNewPostFormLists">
                                <div>
                                    <label className="newPostTitle" htmlFor="lists">Sökes</label>
                                    <div className="optionList">
                                        <div className="padding">
                                            <input
                                                type="checkbox"
                                                id="stomme"
                                                name="Stomme"
                                                value="Stomme"
                                                onChange={(e) =>
                                                    setSearchingFor({
                                                        ...searchingFor,
                                                        [e.target.name]: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label htmlFor="stomme">Stomme</label>
                                        </div>
                                        <div className="padding">
                                            <input
                                                type="checkbox"
                                                id="inredning"
                                                name="Inredning"
                                                value="Inredning"
                                                onChange={(e) =>
                                                    setSearchingFor({
                                                        ...searchingFor,
                                                        [e.target.name]: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label htmlFor="inredning">Inredning</label>
                                        </div>
                                        <div className="padding">
                                            <input
                                                type="checkbox"
                                                id="smasaker"
                                                name="Småsaker"
                                                value="Småsaker"
                                                onChange={(e) =>
                                                    setSearchingFor({
                                                        ...searchingFor,
                                                        [e.target.name]: e.target.checked,
                                                    })
                                                } />
                                            <label htmlFor="smasaker">Småsaker</label>
                                        </div>
                                        <div className="padding">
                                            <input
                                                type="checkbox"
                                                id="ovrigt"
                                                name="Övrigt"
                                                value="Övrigt"
                                                onChange={(e) =>
                                                    setSearchingFor({
                                                        ...searchingFor,
                                                        [e.target.name]: e.target.checked,
                                                    })
                                                } />
                                            <label htmlFor="ovrigt">Övrigt</label>

                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="newPostTitle" htmlFor="lists">Skänkes</label>
                                    <div className="optionList">
                                        <div className="padding">
                                            <input
                                                type="checkbox"
                                                id="_stomme"
                                                name="Stomme"
                                                value="Stomme"
                                                onChange={(e) =>
                                                    setOffering({
                                                        ...offering,
                                                        [e.target.name]: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label htmlFor="_stomme">Stomme</label>
                                        </div>
                                        <div className="padding">
                                            <input
                                                type="checkbox"
                                                id="_inredning"
                                                name="Inredning"
                                                value="Inredning"
                                                onChange={(e) =>
                                                    setOffering({
                                                        ...offering,
                                                        [e.target.name]: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label htmlFor="_inredning">Inredning</label>
                                        </div>
                                        <div className="padding">
                                            <input
                                                type="checkbox"
                                                id="_smasaker"
                                                name="Småsaker"
                                                value="Småsaker"
                                                onChange={(e) =>
                                                    setOffering({
                                                        ...offering,
                                                        [e.target.name]: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label htmlFor="_smasaker">Småsaker</label>
                                        </div>
                                        <div className="padding">
                                            <input
                                                type="checkbox"
                                                id="_ovrigt"
                                                name="Övrigt"
                                                value="Övrigt"
                                                onChange={(e) =>
                                                    setOffering({
                                                        ...offering,
                                                        [e.target.name]: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label htmlFor="_ovrigt">Övrigt</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="addNewPostFormDescription">
                                <label className="newPostTitle" htmlFor="description">Beskrivning *</label>
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
                            </div>
                            <div className="addNewPostFormContact">
                                <label className="newPostTitle" htmlFor="contact">Kontakt *</label>
                                <textarea
                                    id="contact"
                                    name="contact"
                                    rows={3}
                                    cols={100}
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="addNewPostFormExternalLinks">
                                <label className="newPostTitle" htmlFor="externalLinks">Länkar</label>
                                <textarea
                                    id="externalLinks"
                                    name="externalLinks"
                                    rows={1}
                                    cols={100}
                                    value={externalLinks}
                                    onChange={(e) => setExternalLinks(e.target.value)}
                                />
                            </div>
                            <div className="addNewPostFormSubmit">
                                <button type="submit">Spara</button>
                            </div>
                            <div className="message">{message ? <p>{message}</p> : null}</div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="footer" id="footer">
                <div className="footerContainer">
                    <div className="footerRow">
                        <div className="footerHeader">STUNS</div>
                        <div className="footerLink">
                            <a href="https://stuns.se/" target="_blank" rel="noreferrer">
                                STUNS
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}