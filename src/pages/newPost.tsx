import React from "react";
import { useRouter } from "next/router";

export default function addNewPost() {
    const router = useRouter();

    // const goToMap = () => {
    //     router.push("/");
    // };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        router.push("/");
    }


    return (
        <>
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
                            <div className="addNewPostFormName">
                                <label htmlFor="name">* Namn</label>
                                <input type="text" id="name" name="name" required />
                            </div>
                            <div className="addNewPostFormOrganization">
                                <label htmlFor="organization">* Organisation</label>
                                <input type="text" id="organization" name="organization" required />
                            </div>
                            <div className="addNewPostFormDescription">
                                <label htmlFor="description">* Beskrivning</label>
                                <textarea id="description" name="description" rows={20} cols={100} required />
                            </div>
                            <div className="addNewPostFormImage">
                                <label htmlFor="image">Bild (Valfri)</label>
                                <input type="file" id="image" name="image" />
                            </div>
                            <div className="addNewPostFormLocation">
                                <label htmlFor="location">* Plats</label>
                                <input type="text" id="location" name="location" placeholder="Skriv dina koordinater" required />
                            </div>
                            <div className="addNewPostFormContact">
                                <label htmlFor="contact">* Kontakt</label>
                                <textarea id="contact" name="contact" rows={3} cols={100} required />
                            </div>
                            <div className="addNewPostFormSubmit">
                                <button type="submit">Spara</button>
                            </div>
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