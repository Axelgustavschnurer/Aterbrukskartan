import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function sidebar({ setFilter }: any) {

    const [isOpen, setOpen] = useState(true);
    const toggleMenu = () => setOpen(!isOpen);

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

    const [value, setValue] = useState(2028);

    function handleChange(event: any) {
        setValue(event.target.value);
    }

    const currentDate = new Date().getFullYear()  // returns the current year

    return (
        <>
            {isOpen && (
                <div className="sidebar">
                    <div className="rSliderContainer">
                        <div className="range-slider">
                            <input type="range" min={currentDate} max={currentDate + 10} value={value} onChange={handleChange}
                            />
                            <p style={{ margin: "10px" }}>År: {value}</p>
                        </div>
                    </div>
                    <div className="filterBtn">
                        <div className="alignBtn">
                            <button id="demoBtn" onClick={() => onButtonClick("rivning")}><img src="/images/riv.svg"></img></button>
                            <p>Riv</p>
                        </div>
                        <div className="alignBtn">
                            <button id="buildBtn" onClick={() => onButtonClick("byggnad")}><img src="/images/bygg.svg" ></img></button>
                            <p>Bygg</p>
                        </div>
                        <div className="alignBtn">
                            <button id="rebuildBtn" onClick={() => onButtonClick("ombyggnad")}><img src="/images/ater.svg"></img></button>
                            <p>Återbygg</p>
                        </div>
                    </div>
                    <div className="checkbox">
                        <div className="checkboxContainer">
                            <input type="checkbox" id="partCategory1" name="stomme" value="stomme"></input>
                            <label for="stomme"> Stomme</label>
                        </div>
                        <div className="checkboxContainer">
                            <input type="checkbox" id="partCategory2" name="inredning" value="inredning"></input>
                            <label for="inredning"> Inredning</label>
                        </div>
                        <div className="checkboxContainer">
                            <input type="checkbox" id="partCategory3" name="Losgrejer" value="Losgrejer"></input>
                            <label for="Losgrejer"> Tredje punkten</label>
                        </div>            
                    </div>
                    <div className="clearFilter">
                        <button id="clearBtn" onClick={() => onButtonClick("none")}>Rensa filter</button>
                    </div>
                    <div className="sidebarClose">
                        <button id="hideBtn" onClick={toggleMenu}><img src="/closeArrow.svg" alt="Closing arrow" /></button>
                    </div>
                </div>
            )}
            {!isOpen && (
                <div className="hiddenSidebar">
                    <div className="sidebarOpen">
                        <button id="openBtn" onClick={toggleMenu}><img src="/openArrow.svg" alt="Open arrow" /></button>
                    </div>
                </div>
            )}
        </>
    );
}