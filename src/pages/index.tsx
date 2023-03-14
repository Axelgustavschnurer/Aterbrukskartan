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
                <title>Lägg till inlägg</title>
                <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
            </Head>
            <div className={styles.header} id={styles.header}>
                <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
            </div>

            <div className={styles.addPostContainer}>
                <div className={styles.addNewPostContainer}>
                    <h1 className={styles.addNewPostTitle}>Vilken sida vill du besöka</h1>
                    <div className={styles.gotoContainer}>
                        <div className={styles.gotoImg}>
                            <Image src="/images/aterbruk.png" alt="logo" width={500} height={250} onClick={gotoStunsAterbrukkarta} />
                            <p>Återbrukskartan</p>
                        </div>
                        <div className={styles.gotoImg}>
                            <Image src="/images/aterbruk.png" alt="logo" width={500} height={250} onClick={gotoStories} />
                            <p>Stuns Street Map</p>
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