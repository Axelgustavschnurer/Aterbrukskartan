import Link from "next/link";

// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
    return <>
        <main>
            <div className="display-flex" style={{color: "white"}}>
                <section className="flex-grow-100 display-flex align-items-center" style={{width: "50%", position: "relative", justifyContent: "center", height: "750px"}}>
                    <div style={{maxWidth: "100%", width: "100%",  height: "750px", objectFit: "cover", position: "absolute", zIndex: "0", left: 0, top: 0, backgroundColor: "#191919", opacity: ".75"}}></div>
                    <img src="/images/backgrounds/stories.jpg" alt="" height={750} style={{maxWidth: "100%", width: "100%", objectFit: "cover", position: "absolute", zIndex: "-1", left: 0, top: 0}} />
                    <div className="padding-200">
                        <h2 style={{fontSize: "2em"}}>STUNS Stories</h2>
                        <p style={{fontSize: "1.25em"}}>Upptäck hur studenter löser framtidens hållbarhetsutmaningar.</p>
                        <p style={{marginTop: "2em"}}><Link href="/stories" style={{padding: ".75em 3em", backgroundColor: "#f90", borderRadius: "3px", color: "black", fontWeight: "bold", textDecoration: "none"}}>Utforska</Link></p>
                    </div>
                </section>
                <section className="flex-grow-100 display-flex align-items-center" style={{width: "50%", position: "relative", justifyContent: "center", height: "750px"}}>
                    <div style={{maxWidth: "100%", width: "100%",  height: "750px", objectFit: "cover", position: "absolute", zIndex: "0", left: 0, top: 0, backgroundColor: "#191919", opacity: ".75"}}></div>
                    <img src="/images/backgrounds/återbruk.jpg" alt="" height={750} style={{maxWidth: "100%", width: "100%", objectFit: "cover", position: "absolute", zIndex: "-1", left: 0, top: 0}} />
                    <div className="padding-200">
                        <h2 style={{fontSize: "2em"}}>Återbrukskartan</h2>
                        <p style={{fontSize: "1.25em"}}>Verktyg för att utnyttja återvunnit material vid nybygge.</p>
                        <p style={{marginTop: "2em"}}><Link href="/aterbruk" style={{padding: ".75em 3em", backgroundColor: "darkseagreen", borderRadius: "3px", color: "black", fontWeight: "bold", textDecoration: "none"}}>Utforska</Link></p>    
                    </div>
                </section>
            </div>
            <section className="layout-main padding-200">
                <h1 style={{fontSize: "2em"}}>STUNS Kartor</h1>
                <p style={{fontSize: "1.25em"}}>En samling kartor framtagna av STUNS</p>
                <div className="display-flex gap-100 flex-wrap-wrap">
                    <a href="/stories" style={{borderRadius: ".5em", boxShadow: "0 0 .5em lightgray", width: "350px", minHeight: "400px" }}> 
                        <img src="/images/backgrounds/stories.jpg" alt="" style={{borderRadius: ".5em .5em 0 0", width: "100%", height: "200px", objectFit: "cover"}} />
                        <div style={{padding: "1em"}}>
                            <strong>STUNS Stories</strong>
                            <p>Upptäck hur studenter löser framtidens hållbarhetsutmaningar.</p>
                        </div>
                    </a>
                    <a href="/aterbruk" style={{borderRadius: ".5em", boxShadow: "0 0 .5em lightgray", width: "350px", minHeight: "400px" }} >
                        <img src="/images/backgrounds/återbruk.jpg" alt="" style={{borderRadius: ".5em .5em 0 0", width: "100%", height: "200px", objectFit: "cover"}} />
                        <div style={{padding: "1em"}}>
                            <strong>Återbrukskartan</strong>
                            <p>Verktyg för att utnyttja återvunnit material vid nybygge.</p>
                        </div>
                    </a>
                </div>
            </section>
        </main>
    </>
}