import React from "react";
import styles from '../styles/modal.module.css';


// This is the modal component used to confirm deletion of a post
export default function Modal(props: any) {
  const modalState = props.toggle;
  const action = props.action;
  const handleDelete = props.handleDelete;

  return (
    <div className={`${styles.container} ${modalState ? styles.active : ''}`}>
      <div className={styles.modal}>
        <h2 style={{marginTop: "0"}}>Vill du verkligen ta bort detta inlägg?</h2>
        <p>Du håller på att ta bort ett inlägg, är du säker att du vill göra detta?</p>
        <div style={{backgroundColor: "pink", borderLeft: "5px solid var(--danger)", padding: "1em", borderRadius: "0 3px 3px 0"}}>
          <div style={{display: "flex", gap: "2em", alignItems: "center", justifyContent: "flex-start"}}>
            <img src="/alert.svg" alt="warning" height={24} width={24} style={{width: "unset", margin: "unset"}}/>
            <span style={{width: "unset", margin: "unset", fontSize: "24px"}}>Varning</span>
          </div>
          <p style={{marginBottom: "0"}}>Det går ej att ångra detta val.</p>
        </div>
        <div className={styles.btnContainer}>
            <button style={{backgroundColor: "var(--light)", color: "black"}} onClick={action}>Avbryt</button>
            <button className="danger" style={{flexGrow: "unset", padding: "1em"}} onClick={handleDelete}>Radera</button>
        </div>
      </div>
    </div >
  )
}

export function DangerousModal(props: { toggle: boolean, cancel: Function, delete: Function }) {
  const modalState = props.toggle;
  const cancel = props.cancel;
  const handleDelete = props.delete;

  return (
    <div className={`${styles.container} ${modalState ? styles.active : ''}`}>
      <div className={styles.modal}>
        <p>Vill du verkligen ta bort detta inlägg?</p>
        <p><strong>EFTERSOM DETTA INLÄGG REDAN ÄR INAKTIVT KOMMER DET ATT TAS BORT UR DATABASEN OM DU KLICKAR PÅ &quot;TA BORT&quot;</strong></p>
        <div className={styles.btnContainer}>
          <div className={styles.btn} onClick={() => handleDelete()}>
            <button style={{ backgroundColor: 'red' }}>Ta bort</button>
          </div>
          <div className={styles.btn} onClick={() => cancel()}>
            <button>Avbryt</button>
          </div>
        </div>
      </div>
    </div >
  )
}