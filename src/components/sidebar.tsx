import React from "react";
import { useRouter } from "next/router";

export default function sidebar({ setFilter }) {

    const onButtonClick = (filter) => {
        setFilter(filter);
        console.log(filter);
    };

    return (
        <>
            <div className="sidebar">
                <div className="filterBtn">
                    <div className="alignBtn">
                        <button id="demoBtn" onClick={() => onButtonClick("red")}><img src="/images/riv.svg"></img></button>
                        <p>Riv</p>
                    </div>
                    <div className="alignBtn">
                        <button id="buildBtn" onClick={() => onButtonClick("blue")}><img src="/images/bygg.svg" ></img></button>
                        <p>Bygg</p>
                    </div>
                    <div className="alignBtn">
                        <button id="rebuildBtn" onClick={() => onButtonClick("green")}><img src="/images/ater.svg"></img></button>
                        <p>Återbygg</p>
                    </div>
                </div>
            </div>
        </>
    );
}