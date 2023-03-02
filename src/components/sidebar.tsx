import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "./dualSlider";

// Sidebar component for filtering the map

export default function Sidebar({ setFilter }: any) {
    // Gets current year to set as default value for slider
    const currentDate = new Date().getFullYear()

    // Handles the state of the sidebar's visibility
    const [isOpen, setOpen] = useState(true);
    const [newData, setNewData] = useState([])
    const [projectType, setProjectType] = useState([])
    const [lookingForMaterials, setLookingForMaterials] = useState([])
    const [availableMaterials, setAvailableMaterials] = useState([])
    const [organisation, setOrganisation] = useState([])

    let projectTypes: string[] = (() => {
        let types: string[] = [];
        // TODO: Fix error
        for (let key in projectType) {
            if (projectType[key]) {
                types.push(key);
            }
        }
        return types;
    })();
    console.log("projectTypes", projectTypes);

    let lookingFor: string[] = (() => {
        let materials: string[] = [];
        // TODO: Fix error
        for (let key in lookingForMaterials) {
            if (lookingForMaterials[key]) {
                materials.push(key);
            }
        }
        return materials;
    })();
    console.log("lookingFor", lookingFor);

    let available: string[] = (() => {
        let materials: string[] = [];
        for (let key in availableMaterials) {
            if (availableMaterials[key]) {
                materials.push(key);
            }
        }
        return materials;
    })();
    console.log("available", available);

    let organisations: string[] = (() => {
        let orgs: string[] = [];
        for (let key in organisation) {
            if (organisation[key]) {
                orgs.push(key);
            }
        }
        return orgs;
    })();
    console.log("organisations", organisations);


    const toggleMenu = () => {
        setOpen(!isOpen);
    };

    // Closes the sidebar when the user navigates to a new page
    const router = useRouter();
    useEffect(() => {
        const closeMenu = () => isOpen && setOpen(false);
        router.events.on("routeChangeStart", closeMenu);
        return () => {
            router.events.off("routeChangeStart", closeMenu);
        };
    }, [isOpen, router]);

    const fetchData = async () => {
        const response = await fetch('http://localhost:3000/api/getData')
        const data = await response.json()
        setNewData(data)
    }

    // Runs fetchData function on component mount
    useEffect(() => {
        fetchData()
    }, [])


    // Declares the filter functionality of the project buttons
    const onButtonClick = (filter: any) => {
        setFilter(filter);
        console.log(filter);
    };

    // Will be used to get and display the organizations from the database
    const getOrganization = () => {
        let mappedData = newData.map((pin: any) => pin.mapItem.organisation)
        let filteredData = mappedData.filter((pin: any, index: any) => mappedData.indexOf(pin) === index)
        return (
            <>
                {filteredData.map((pin: any) => {
                    return (
                        <div className="inputGroup" key={pin}>
                            <input
                                id={pin}
                                name={pin}
                                type="checkbox"
                                onChange={(e) => {
                                    setOrganisation({
                                        ...organisation,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor={pin}>{pin}</label>
                        </div>
                    )
                })}
            </>
        )
    }

    // Returns the sidebar component. It cannot be interacted with if it is closed, other than opening it. 
    // It contains the type project buttons and the slider for filtering the map, as well as a form for filtering parts and organizastions, on top of a button to clear the current filter. 
    // Lastly, it contains a button for closing the sidebar. 
    return (
        <>
            {isOpen && (
                <div className="sidebar">
                    <div className="filterBtn">
                        <div className="alignBtn">
                            <button
                                id="demoBtn"
                                onClick={() => onButtonClick("Rivning")}>
                                <img src="/images/riv.svg"></img>
                            </button>
                            <p>Rivning</p>
                        </div>
                        <div className="alignBtn">
                            <button
                                id="buildBtn"
                                onClick={() => onButtonClick("Nybyggnation")}>
                                <img src="/images/bygg.svg" ></img>
                            </button>
                            <p>Nybyggnation</p>
                        </div>
                        <div className="alignBtn">
                            <button
                                id="rebuildBtn"
                                onClick={() => onButtonClick("Ombyggnation")}>
                                <img src="/images/ater.svg"></img>
                            </button>
                            <p>Ombyggnation</p>
                        </div>
                    </div>
                    <div className="rSliderContainer">
                        <div className="range-slider">
                            <DualRangeSlider
                                min={currentDate}
                                max={currentDate + 10}
                                onChange={({ min, max }: any) => console.log(`min = ${min}, max = ${max}`)}
                            />
                        </div>
                    </div>

                    <form className="form">
                        <h3>Sökes</h3>
                        <div className="inputGroup">
                            <input
                                id="stommeSokes"
                                name="stommeSokes"
                                type="checkbox"
                                onChange={(e) => {
                                    setLookingForMaterials({
                                        ...lookingForMaterials,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor="stommeSokes">Stomme</label>
                        </div>

                        <div className="inputGroup">
                            <input
                                id="inredningSokes"
                                name="inredningSokes"
                                type="checkbox"
                                onChange={(e) => {
                                    setLookingForMaterials({
                                        ...lookingForMaterials,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor="inredningSokes">Inredning</label>
                        </div>

                        <div className="inputGroup">
                            <input
                                id="smasakerSokes"
                                name="smasakerSokes"
                                type="checkbox"
                                onChange={(e) => {
                                    setLookingForMaterials({
                                        ...lookingForMaterials,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor="smasakerSokes">Småsaker</label>
                        </div>

                        <div className="inputGroup">
                            <input
                                id="ovrigtSokes"
                                name="ovrigtSokes"
                                type="checkbox"
                                onChange={(e) => {
                                    setLookingForMaterials({
                                        ...lookingForMaterials,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor="ovrigtSokes">Övrigt</label>
                        </div>

                        <h3>Skänkes</h3>
                        <div className="inputGroup">
                            <input
                                id="stommeSankes"
                                name="stommeSankes"
                                type="checkbox"
                                onChange={(e) => {
                                    setAvailableMaterials({
                                        ...availableMaterials,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor="stommeSankes">Stomme</label>
                        </div>

                        <div className="inputGroup">
                            <input
                                id="inredningSankes"
                                name="inredningSankes"
                                type="checkbox"
                                onChange={(e) => {
                                    setAvailableMaterials({
                                        ...availableMaterials,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor="inredningSankes">Inredning</label>
                        </div>

                        <div className="inputGroup">
                            <input
                                id="smasakerSankes"
                                name="smasakerSankes"
                                type="checkbox"
                                onChange={(e) => {
                                    setAvailableMaterials({
                                        ...availableMaterials,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor="smasakerSankes">Småsaker</label>
                        </div>

                        <div className="inputGroup">
                            <input
                                id="ovrigtSankes"
                                name="ovrigtSankes"
                                type="checkbox"
                                onChange={(e) => {
                                    setAvailableMaterials({
                                        ...availableMaterials,
                                        [e.target.name]: e.target.checked
                                    })
                                }}
                            />
                            <label htmlFor="ovrigtSankes">Övrigt</label>
                        </div>

                        <h3>Organisation</h3>
                        {getOrganization()}

                    </form>
                    <div className="clearFilter">
                        <button
                            id="clearBtn"
                            onClick={() => onButtonClick("none")}>
                            Rensa filter
                        </button>
                    </div>
                    <div className="sidebarClose">
                        <button
                            id="hideBtn"
                            onClick={toggleMenu}>
                            <img src="/closeArrow.svg" alt="Closing arrow" />
                        </button>
                    </div>
                </div>
            )
            }
            {
                !isOpen && (
                    <div className="hiddenSidebar">
                        <div className="sidebarOpen">
                            <button
                                id="openBtn"
                                onClick={toggleMenu}>
                                <img src="/openArrow.svg" alt="Open arrow" />
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
}