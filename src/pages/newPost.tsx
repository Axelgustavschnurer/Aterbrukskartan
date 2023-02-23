import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function addNewPost() {
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        router.push("/");
    }

    const Map = React.useMemo(() => dynamic(
        () => import('../components/newPostMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [/* list variables which should trigger a re-render here */])

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
                            <div className="addNewPostFormOrganization">
                                <label className="newPostTitle" htmlFor="organization">* Organisation</label>
                                <input type="text" id="organization" name="organization" required />
                            </div>
                            <div className="typeOfProject">
                                <label className="newPostTitle" htmlFor="type">Typ av projekt</label>
                                <div className="test">
                                    <input type="checkbox" id="riv" name="riv" value="riv" />
                                    <label htmlFor="riv">Rivning </label>
                                </div>
                                <div className="test">
                                    <input type="checkbox" id="bygg" name="bygg" value="bygg" />
                                    <label htmlFor="riv">Byggnation </label>
                                </div>
                                <div className="test">
                                    <input type="checkbox" id="ombygge" name="ombygge" value="ombygge" />
                                    <label htmlFor="riv">Ombyggnation</label>
                                </div>
                            </div>
                            <div className="addNewPostFormLocation">
                                <label className="newPostTitle" htmlFor="location">* Plats</label>
                                <Map />
                            </div>
                            <div className="addNewPostFormDescription">
                                <label className="newPostTitle" htmlFor="description">* Beskrivning</label>
                                <textarea id="description" name="description" rows={10} maxLength={3000} required placeholder="Vad finns/sökes, hur mycket (Ex. mått och vikt). " />
                            </div>
                            <div className="addNewPostFormContact">
                                <label className="newPostTitle" htmlFor="contact">* Kontakt</label>
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