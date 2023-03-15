import React from "react";
import styles from '../styles/modal.module.css';

export default function Modal(props: any) {
    const modalState = props.toggle;
    const action = props.action;
    const handleDelete = props.handleDelete;

    return (
        <div className={`${styles.container} ${modalState ? styles.active : ''}`}>
            <div className={styles.modal}>
                Vill du värkligen ta bort detta inlägg?
                <div className={styles.btnContainer}>
                    <div className={styles.btn} onClick={handleDelete}>
                        <button>Ta bort</button>
                    </div>
                    <div className={styles.btn} onClick={action}>
                        <button>Avbryt</button>
                    </div>
                </div>
            </div>
        </div>
    )
}