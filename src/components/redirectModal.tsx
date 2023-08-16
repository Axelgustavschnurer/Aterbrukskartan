import React from "react";
import styles from '../styles/modal.module.css';


// This is the modal component used to confirm deletion of a post
export default function Modal(props: any) {
  const modalState = props.toggle;

  return (
    <div className={`${styles.container} ${modalState ? styles.active : ''}`}>
      <div className={styles.modal}>
        Vilken karta vill du gå till?
        <div className={styles.btnContainer}>
          <div className={styles.btn} onClick={(e) => window.location.href = "/"}>
            <button>Stories</button>
          </div>
          <div className={styles.btn} onClick={(e) => window.location.href = "/aterbruk"}>
            <button>Återbruk</button>
          </div>
        </div>
      </div>
    </div >
  )
}