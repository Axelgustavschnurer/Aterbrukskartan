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
    const toggleMenu = () => {
        setOpen(!isOpen);
        // TODO change z-index of sidebar 
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

    // Declares the filter functionality of the project buttons
    const onButtonClick = (filter: any) => {
        setFilter(filter);
        console.log(filter);
    };

    // Will be used to get and display the organizations from the database
    const getOrganization = () => {
        // TODO get organization from database
        return (
            <>
                <div className="inputGroup">
                    <input id="Placeholder" name="Placeholder" type="checkbox" />
                    <label htmlFor="Placeholder">Placeholder</label>
                </div>
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
                            <button id="demoBtn" onClick={() => onButtonClick("Rivning")}><img src="/images/riv.svg"></img></button>
                            <p>Rivning</p>
                        </div>
                        <div className="alignBtn">
                            <button id="buildBtn" onClick={() => onButtonClick("Nybyggnation")}><img src="/images/bygg.svg" ></img></button>
                            <p>Nybyggnation</p>
                        </div>
                        <div className="alignBtn">
                            <button id="rebuildBtn" onClick={() => onButtonClick("Ombyggnation")}><img src="/images/ater.svg"></img></button>
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
                            <input id="stommeSokes" name="stommeSokes" type="checkbox" />
                            <label htmlFor="stommeSokes">Stomme</label>
                        </div>

                        <div className="inputGroup">
                            <input id="inredningSokes" name="inredningSokes" type="checkbox" />
                            <label htmlFor="inredningSokes">Inredning</label>
                        </div>

                        <div className="inputGroup">
                            <input id="smasakerSokes" name="smasakerSokes" type="checkbox" />
                            <label htmlFor="smasakerSokes">Småsaker</label>
                        </div>

                        <h3>Skänkes</h3>
                        <div className="inputGroup">
                            <input id="stommeSankes" name="stommeSankes" type="checkbox" />
                            <label htmlFor="stommeSankes">Stomme</label>
                        </div>

                        <div className="inputGroup">
                            <input id="inredningSankes" name="inredningSankes" type="checkbox" />
                            <label htmlFor="inredningSankes">Inredning</label>
                        </div>

                        <div className="inputGroup">
                            <input id="smasakerSankes" name="smasakerSankes" type="checkbox" />
                            <label htmlFor="smasakerSankes">Småsaker</label>
                        </div>

                        <h3>Organisation</h3>
                        {getOrganization()}

                    </form>
                    <div className="clearFilter">
                        <button id="clearBtn" onClick={() => onButtonClick("none")}>Rensa filter</button>
                    </div>
                    <div className="sidebarClose">
                        <button id="hideBtn" onClick={toggleMenu}><img src="/closeArrow.svg" alt="Closing arrow" /></button>
                    </div>
                </div>
            )
            }
            {
                !isOpen && (
                    <div className="hiddenSidebar">
                        <div className="sidebarOpen">
                            <button id="openBtn" onClick={toggleMenu}><img src="/openArrow.svg" alt="Open arrow" /></button>
                        </div>
                    </div>
                )
            }
        </>
    );
}