import React from "react";
import styles from "../styles/errors.module.css";

export default function NotFound() {
    return (
        <div className={styles.container}>
            <h1>404 </h1>
            <h2>This page could not be found.</h2>
        </div>

    )
}