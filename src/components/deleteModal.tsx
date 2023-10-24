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
        Vill du verkligen ta bort detta inlägg?
        <div className={styles.btnContainer}>
          <div className={styles.btn} onClick={handleDelete}>
            <button className="danger">Ta bort</button>
          </div>
          <div className={styles.btn} onClick={action}>
            <button>Avbryt</button>
          </div>
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