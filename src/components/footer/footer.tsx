import Image from "next/image";
import styles from "./footer.module.css";

// Footer component
export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className="layout-main grid-auto-rows gap-200">
          <section className={styles.section}>
            <h2>Data</h2>
            <a href="https://www.dataportal.se/datasets/763_1927/forteckning-over-stuns-samverkansprojekt-i-energy-stories-samt-installationer#ref=?p=1&q=stuns&s=2&t=20&f=&rt=dataset%24esterms_IndependentDataService%24esterms_ServedByDataService&c=false" target="_blank" rel="noreferrer">
              Dataportalen - Stories
            </a>
            <a href="https://www.dataportal.se/en/datasets/763_1492/solar-power-production-region-uppsala-solar-power-plants-1-minute-resolution#ref=?p=1&q=stuns%20&s=2&t=20&f=&rt=dataset%24esterms_IndependentDataService%24esterms_ServedByDataService" target="_blank" rel="noreferrer">
              Dataportalen - Solceller
            </a>
          </section>
          <section className={styles.section}>
            <h2>Stuns</h2>
            <a href="https://stuns.se/" target="_blank" rel="noreferrer">
              STUNS
            </a>
            <a href="https://energi.stuns.se/" target="_blank" rel="noreferrer">
              Stuns Energi
            </a>
            <a href="https://learning.stuns.se/" target="_blank" rel="noreferrer">
              Stuns Stories
            </a>
          </section >
          <section className={styles.section}>
            <h2>Övrigt</h2>
            <a href="https://energiportalregionuppsala.se/" target="_blank" rel="noreferrer">
              Energiportalen
            </a>
          </section >
          <section className={styles.section}>
            <Image src="/images/euLogo.png" alt="EU logo" width={164} height={57} />
          </section>
          </div>
      </footer>
    </>
  )
}