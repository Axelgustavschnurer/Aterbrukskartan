import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState } from "react";
import Head from "next/head";
import { latLng } from "leaflet";


export default function AddNewPost() {
    const [organization, setOrganization] = useState("");
    const [projectType, setProjectType] = useState("");
    const [location, setLocation] = useState("");
    const [searchingFor, setSearchingFor] = useState("");
    const [offering, setOffering] = useState("");
    const [description, setDescription] = useState("");
    const [contact, setContact] = useState("");
    const [message, setMessage] = useState("");

    const router = useRouter();

    const getProjectType = (e: any) => {
        setProjectType(e.target.value);
        console.log("value: ", e.target.value);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            console.log(JSON.stringify({
                organization,
                projectType,
                location,
                searchingFor,
                offering,
                description,
                contact,
            }))
            let res = await fetch("http://localhost:3000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organization,
                    projectType,
                    location,
                    searchingFor,
                    offering,
                    description,
                    contact,
                }),
            });
            let resJson = await res.json();
            if (res.status === 200) {
                setOrganization("");
                setProjectType("");
                setLocation("");
                setSearchingFor("");
                setOffering("");
                setDescription("");
                setContact("");
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
                                <label className="newPostTitle" htmlFor="organization">* Organisation</label>
                                <input
                                    type="text"
                                    id="organization"
                                    name="organization"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="typeOfProject">
                                <label className="newPostTitle" htmlFor="type">Typ av projekt</label>
                                <div className="test">
                                    <input
                                        type="radio"
                                        id="riv"
                                        name="category"
                                        value="riv"
                                        onChange={getProjectType}
                                    />
                                    <label htmlFor="riv">Rivning </label>
                                </div>
                                <div className="test">
                                    <input
                                        type="radio"
                                        id="bygg"
                                        name="category"
                                        value="bygg"
                                        onChange={getProjectType}
                                    />
                                    <label htmlFor="bygg">Byggnation </label>
                                </div>
                                <div className="test">
                                    <input
                                        type="radio"
                                        id="ombygge"
                                        name="category"
                                        value="ombygge"
                                        onChange={getProjectType}
                                    />
                                    <label htmlFor="ombygge">Ombyggnation</label>
                                </div>
                            </div>
                            <div className="addNewPostFormLocation">
                                <label className="newPostTitle" htmlFor="location">* Plats</label>
                                <NewPostMap />
                            </div>
                            <div className="addNewPostFormLists">
                                <div>
                                    <label className="newPostTitle" htmlFor="lists">Sökes</label>
                                    <div className="optionList">
                                        <div className="test">
                                            <input type="checkbox" id="stomme" name="stomme" value="stomme" />
                                            <label htmlFor="material">Stomme</label>
                                        </div>
                                        <div className="test">
                                            <input type="checkbox" id="inredning" name="inredning" value="inredning" />
                                            <label htmlFor="material">Inredning</label>
                                        </div>
                                        <div className="test">
                                            <input type="checkbox" id="smasaker" name="smasaker" value="smasaker" />
                                            <label htmlFor="material">Småsaker</label>
                                        </div>
                                        <div className="test">
                                            <input type="checkbox" id="ovrigtSokes" name="ovrigtSokes" value="ovrigtSokes" />
                                            <label htmlFor="material">Övrigt</label>

                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="newPostTitle" htmlFor="lists">Skänkes</label>
                                    <div className="optionList">
                                        <div className="test">
                                            <input type="checkbox" id="stomme" name="stomme" value="stomme" />
                                            <label htmlFor="material">Stomme</label>
                                        </div>
                                        <div className="test">
                                            <input type="checkbox" id="inredning" name="inredning" value="inredning" />
                                            <label htmlFor="material">Inredning</label>
                                        </div>
                                        <div className="test">
                                            <input type="checkbox" id="smasaker" name="smasaker" value="smasaker" />
                                            <label htmlFor="material">Småsaker</label>
                                        </div>
                                        <div className="test">
                                            <input type="checkbox" id="ovrigtSankes" name="ovrigtSankes" value="ovrigtSankes" />
                                            <label htmlFor="material">Övrigt</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="addNewPostFormDescription">
                                <label className="newPostTitle" htmlFor="description">* Beskrivning</label>
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
                                <label className="newPostTitle" htmlFor="contact">* Kontakt</label>
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

                    {/* <div className="footerRow">
                        <div className="footerHeader">Övrigt</div>
                        <div className="footerLink">
                            <a href="https://energiportalregionuppsala.se/" target="_blank" rel="noreferrer">
                                Energiportalen
                            </a>
                        </div>
                    </div> */}
                </div>
            </div>

        </>
    );
}