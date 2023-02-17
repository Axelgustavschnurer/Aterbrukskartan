import React from "react";
import { useRouter } from "next/router";

export default function sidebar() {
    const router = useRouter();

    const goToSomewhere = () => {
        router.push("/api/hello");
    };

    return (
        <>
            <div className="sidebar">
                <div className="filterBtn">
                    <div className="alignBtn">
                        <button id="demoBtn" onClick={goToSomewhere}><img src="/images/riv.svg"></img></button>
                        <p>Riv</p>
                    </div>
                    <div className="alignBtn">
                        <button id="buildBtn"><img src="/images/bygg.svg" ></img></button>
                        <p>Bygg</p>
                    </div>
                    <div className="alignBtn">
                        <button id="rebuildBtn"><img src="/images/ater.svg"></img></button>
                        <p>Återbygg</p>
                    </div>
                </div>
            </div>
        </>
    );
}