import Link from "next/link";
import styles from '@/styles/index.module.css'

export default function Page() {
    return <>
        <main>
            <div className={styles.gridAutoRowsHome} style={{color: "white"}}>
                <section className={`flex-grow-100 display-flex align-items-center ${styles.featured}`}>
                    <div className={styles.featuredOverlay}></div>
                    <img src="/images/backgrounds/stories.jpg" alt="" className={styles.featuredImage}/>
                    <div className="padding-200">
                        <h2 style={{fontSize: "2em"}}>STUNS Stories</h2>
                        <p style={{fontSize: "1.25em"}}>Upptäck hur studenter löser framtidens hållbarhetsutmaningar.</p>
                        <p style={{marginTop: "2em"}}><Link href="/stories" className={styles.featuredLink} style={{backgroundColor: "#f90"}}>Utforska</Link></p>
                    </div>
                </section>
                <section className={`flex-grow-100 display-flex align-items-center ${styles.featured}`}>
                    <div className={styles.featuredOverlay}></div>
                    <img src="/images/backgrounds/återbruk.jpg" alt="" className={styles.featuredImage} />
                    <div className="padding-200">
                        <h2 style={{fontSize: "2em"}}>Återbrukskartan</h2>
                        <p style={{fontSize: "1.25em"}}>Verktyg för att utnyttja återvunnit material vid nybygge.</p>
                        <p style={{marginTop: "2em"}}><Link href="/aterbruk" className={styles.featuredLink} style={{backgroundColor: "darkseagreen"}}>Utforska</Link></p>    
                    </div>
                </section>
            </div>
            <section className="layout-main padding-200">
                <h1 style={{fontSize: "2em"}}>STUNS Kartor</h1>
                <p style={{fontSize: "1.25em"}}>En samling kartor framtagna av STUNS</p>
                <div className="display-flex gap-200 flex-wrap-wrap">
                    <a href="/stories" className={styles.linkCard}> 
                        <img src="/images/backgrounds/stories.jpg" alt=""/>
                        <div>
                            <strong>STUNS Stories</strong>
                            <p>Upptäck hur studenter löser framtidens hållbarhetsutmaningar.</p>
                        </div>
                    </a>
                    <a href="/aterbruk" className={styles.linkCard} >
                        <img src="/images/backgrounds/återbruk.jpg" alt="" />
                        <div>
                            <strong>Återbrukskartan</strong>
                            <p>Verktyg för att utnyttja återvunnit material vid nybygge.</p>
                        </div>
                    </a>
                </div>
            </section>
        </main>
    </>
}