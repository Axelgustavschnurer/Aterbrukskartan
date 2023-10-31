import Link from "next/link";
import styles from '@/styles/index.module.css'

export default function Page() {
    return <>
        <main>
            <div className="display-flex" style={{color: "white"}}>
                <section className={`flex-grow-100 display-flex align-items-center ${styles.featured}`}>
                    <div className={styles.featuredOverlay}></div>
                    <img src="/images/backgrounds/stories.jpg" alt="" className={styles.featuredImage}/>
                    <div className="padding-200">
                        <h2 style={{fontSize: "2em"}}>STUNS Stories</h2>
                        <p style={{fontSize: "1.25em"}}>Upptäck hur studenter löser framtidens hållbarhetsutmaningar.</p>
                        <p style={{marginTop: "2em"}}><Link href="/stories" style={{padding: ".75em 3em", backgroundColor: "#f90", borderRadius: "3px", color: "black", fontWeight: "bold", textDecoration: "none"}}>Utforska</Link></p>
                    </div>
                </section>
                <section className={`flex-grow-100 display-flex align-items-center ${styles.featured}`}>
                    <div className={styles.featuredOverlay}></div>
                    <img src="/images/backgrounds/återbruk.jpg" alt="" className={styles.featuredImage} />
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
                    <a href="/stories" className={styles.linkCard}> 
                        <img src="/images/backgrounds/stories.jpg" alt="" style={{borderRadius: ".5em .5em 0 0", width: "100%", height: "200px", objectFit: "cover"}} />
                        <div style={{padding: "1em"}}>
                            <strong>STUNS Stories</strong>
                            <p>Upptäck hur studenter löser framtidens hållbarhetsutmaningar.</p>
                        </div>
                    </a>
                    <a href="/aterbruk" className={styles.linkCard} >
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