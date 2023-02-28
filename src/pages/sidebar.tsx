import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DualRangeSlider from "../components/dualSlider";


export default function Sidebar({ setFilter }: any) {
    const currentDate = new Date().getFullYear()  // returns the current year

    // const [sliderValue, setSliderValue] = useState<Range>({
    //     min: currentDate,
    //     max: currentDate + 10,
    // });

    const [isOpen, setOpen] = useState(true);
    const toggleMenu = () => {
        setOpen(!isOpen);
        // TODO change z-index of sidebar 
    };


    const router = useRouter();

    useEffect(() => {
        const closeMenu = () => isOpen && setOpen(false);
        router.events.on("routeChangeStart", closeMenu);
        return () => {
            router.events.off("routeChangeStart", closeMenu);
        };
    }, [isOpen, router]);


    const onButtonClick = (filter: any) => {
        setFilter(filter);
        console.log(filter);
    };

    const [value, setValue] = useState(currentDate + 5);

    function handleChange(event: any) {
        setValue(event.target.value);
    }

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

    // const handleSliderChange = (value: Range) => {
    //     setSliderValue(value);
    // };

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
                    {/* <div className="checkbox">
                            <div>
                                <h2>Titel</h2>
                                <div className="checkboxContainer">
                                    <input type="checkbox" id="partCategory1" name="stomme" value="stomme"></input>
                                    <label htmlFor="stomme"> Stomme</label>
                                </div>
                                <div className="checkboxContainer">
                                    <input type="checkbox" id="partCategory2" name="inredning" value="inredning"></input>
                                    <label htmlFor="inredning"> Inredning</label>
                                </div>
                                <div className="checkboxContainer">
                                    <input type="checkbox" id="partCategory3" name="smaSaker" value="smaSaker"></input>
                                    <label htmlFor="smaSaker"> Småsaker</label>
                                </div>
    
                            </div>
                        </div> */}

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
                        {/* <div className="inputGroup">
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
                                </div> */}
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