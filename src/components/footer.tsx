import React from "react";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";

import styles from "../styles/footer.module.css";

// Footer component
export default function Footer() {
    const [isOpen, setOpen] = useState(false);

    const toggleMenu = () => {
        setOpen(!isOpen);
    };

    // Closes the sidebar when the user navigates to a new page
    const router = useRouter();
    useEffect(() => {
        const closeMenu = () => isOpen && setOpen(false);
        router.events.on("routeChangeStart", closeMenu);
        return () => {
            router.events.off("routeChangeStart", closeMenu);
        };
    }, [isOpen, router]);

    return (
        <>
            {isOpen && (
                <div className={styles.footer} id={styles.footer}>
                    < div className={styles.footerContainer}>
                        <div className={styles.footerRow}>
                            <div className={styles.footerHeader}>Data</div>
                            <div className={styles.footerLink}>
                                <a href="https://www.dataportal.se/datasets/763_1927/forteckning-over-stuns-samverkansprojekt-i-energy-stories-samt-installationer#ref=?p=1&q=stuns&s=2&t=20&f=&rt=dataset%24esterms_IndependentDataService%24esterms_ServedByDataService&c=false" target="_blank" rel="noreferrer">
                                    Dataportalen - Stories
                                </a>
                            </div >
                        </div >
                        <div className={styles.footerRow}>
                            <div className={styles.footerHeader}>STUNS</div>
                            <div className={styles.footerLink}>
                                <a href="https://stuns.se/" target="_blank" rel="noreferrer">
                                    STUNS
                                </a>
                            </div >
                            <div className={styles.footerLink}>
                                <a href="https://learning.stuns.se/" target="_blank" rel="noreferrer">
                                    Stuns - Stories
                                </a>
                            </div >
                        </div >
                        <div className={styles.footerRow}>
                            <div className={styles.footerHeader}>Övrigt</div>
                            <div className={styles.footerLink}>
                                <a href="https://energiportalregionuppsala.se/" target="_blank" rel="noreferrer">
                                    Energiportalen
                                </a>
                            </div >
                        </div >
                        <div className={styles.euLogoContainer}>
                            <Image src="/images/euLogo.png" alt="EU logo" width={164} height={57} />
                        </div>
                    </div >
                    <div className={styles.sidebarClose}>
                        <button
                            id={styles.hideBtn}
                            onClick={toggleMenu}>
                            <Image src="/downArrow.svg" alt="Closing arrow" width={20} height={20} />
                        </button>
                    </div>
                </div >
            )
            }
            {!isOpen && (
                <div className={styles.hiddenSidebar}>
                    <div className={styles.sidebarOpen}>
                        <button
                            id={styles.openBtn}
                            onClick={toggleMenu}>
                            <Image src="/upArrow.svg" alt="Open arrow" width={20} height={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}