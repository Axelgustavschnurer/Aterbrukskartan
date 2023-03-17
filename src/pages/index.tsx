import React from "react";
import styles from "../styles/homePage.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NavPage() {
    const router = useRouter();

    const gotoStunsAterbrukkarta = () => {
        router.push("/aterbruk");
    };

    const gotoStories = () => {
        router.push("/stories");
    };

    return (
        <>
            <Head>
                <title>Välkommen</title>
                <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
            </Head>
            <div className={styles.header} id={styles.header}>
                <Image src="/images/stuns_logo.png" alt="Bild på Stuns logga" width={170} height={50} />
            </div>

            <div className={styles.addPostContainer}>
                <div className={styles.addNewPostContainer}>
                    <h1 className={styles.addNewPostTitle}>Vilken sida vill du besöka?</h1>
                    <div className={styles.gotoContainer}>
                        <div className={styles.goto}>
                            <div className={styles.gotoImg}>
                                <Image src="/images/aterbruk.png" alt="Bild på återbrukskartan" width={500} height={250} onClick={gotoStunsAterbrukkarta} className={styles.image} />
                            </div>
                            <p>Återbrukskartan</p>
                        </div>
                        <div className={styles.goto}>
                            <div className={styles.gotoImg}>
                                <Image src="/images/story.png" alt="Bild på storieskartan" width={500} height={250} onClick={gotoStories} className={styles.image} />
                            </div>
                            <p>Stories</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footer} id={styles.footer}>
                < div className={styles.footerContainer}>
                    <div className={styles.footerRow}>
                        <div className={styles.footerHeader}>STUNS</div>
                        <div className={styles.footerLink}>
                            <a href="https://stuns.se/" target="_blank" rel="noreferrer">
                                STUNS
                            </a>
                        </div >
                    </div >
                </div >
            </div >
        </>
    );
}