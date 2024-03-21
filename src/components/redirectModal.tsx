import React from "react";
import styles from '../styles/modal.module.css';


// This is the modal component used to confirm deletion of a post
export default function Modal(props: any) {
  const modalState = props.toggle;

  return (
    <div className={`${styles.container} ${modalState ? styles.active : ''}`}>
      <div className={styles.modal}>
        <h1>Vilken karta vill du gå till?</h1>
        <div className={styles.btnContainer}>
          <button type="button" onClick={(e) => window.location.href = "/stories"} style={{ backgroundColor: "#f90" }}>Stories</button>
          <button type="button" onClick={(e) => window.location.href = "/aterbruk"} style={{ backgroundColor: "darkseagreen" }}>Återbruk</button>
        </div>
      </div>
    </div >
  )
}