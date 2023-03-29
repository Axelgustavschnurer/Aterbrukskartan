import React from "react";
import styles from "../styles/errors.module.css";
import { useEffect, useState } from "react";

export default function NotFound() {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Check if the user has set a preference for dark mode
        const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleThemeChange = (e: any) => {
            // Update the theme state variable
            const newTheme = e.matches ? "dark" : "light";
            setTheme(newTheme);
        };
        // Listen for changes to the prefers-color-scheme media query
        darkModeQuery.addEventListener("change", handleThemeChange);
        return () => darkModeQuery.removeEventListener("change", handleThemeChange);
    }, []);
    return (
        <div className={`${styles.container} ${theme === "dark" ? styles.darkMode : styles.lightMode}`}>
            <h1>404 </h1>
            <h2>This page could not be found.</h2>
        </div>

    )
}