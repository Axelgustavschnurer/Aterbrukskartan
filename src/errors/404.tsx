import React from "react";
import styles from "../styles/errors.module.css";
import { useEffect, useState } from "react";

export default function NotFound() {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleThemeChange = (e: any) => {
            const newTheme = e.matches ? "dark" : "light";
            setTheme(newTheme);
        };
        darkModeQuery.addEventListener("change", handleThemeChange);
        return () => darkModeQuery.removeEventListener("change", handleThemeChange);
    }, []);
    return (
        <div className={` ${theme === "dark" ? styles.darkMode : styles.lightMode}`}>
            <h1>404 </h1>
            <h2>This page could not be found.</h2>
        </div>

    )
}