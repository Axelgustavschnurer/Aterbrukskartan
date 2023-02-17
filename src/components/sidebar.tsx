import React from "react";

export default function sidebar() {
    return (
        <>
            <div className="sidebar">
                <div className="filterBtn">
                    <button id="demoBtn"><img src="/images/riv.png" width={60} height={60}></img></button>
                    <button id="buildBtn"><img src="/images/bygg.png" width={60} height={60}></img></button>
                    <button id="rebuildBtn"><img src="/images/ater.png" width={60} height={60}></img></button>
                </div>
            </div>
        </>
    );
}