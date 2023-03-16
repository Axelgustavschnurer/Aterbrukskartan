import React from "react";
import Image from "next/image";
import styles from "../styles/sidebar.module.css";

/**
* Creates buttons for all the categories defined in the array `categories` in this function
*/
export function createCategoryFilter(storyCategory: any, setStoryCategory: any) {
    let categories = {
        "Solel": "solar",
        "Energilagring": "battery", 
        "Hållbarhet": "leaf",
        "Energi": "lightbulb",
        "Stories": "newspaper",
        "Videos": "playbutton",
        "Mätning": "ruler",
        "Vatten": "water",
        "Social-hållbarhet": "social",
        "Hälsa": "heartbeat",
        "Bioteknik": "dna",
        "Öppna-data": "data",
        "Elbil": "car",
        "Transport": "truck",
        "Byggnader": "building",
        "Skolkök": "school",
        "Renovering": "tools",
        "Klimat": "tree",
        "Cases": "case",
        "Effekt": "lightning",
        "Värme": "fire",
        "Cleantech": "gears",
        "Vindkraft": "windmill",
        "Kyla": "snowflake"
    }
    return (
        <>
            {Object.keys(categories).map((category: any) => {  
                return (
                    <div className={styles.alignCategories} key={category}>
                        <button
                            id={styles[category]}
                            className={styles.categoryBtn}
                            value={category}
                            onClick={(e: any) => {
                                if (storyCategory.includes(e.currentTarget.value)) {
                                    setStoryCategory(storyCategory.filter((item: any) => item !== e.currentTarget.value))
                                } else {
                                    setStoryCategory([...storyCategory, e.currentTarget.value])
                                }
                            }}
                        >
                            <Image src={"/images/categories/" + categories[category as keyof typeof categories] + ".svg"} alt={category} width={40} height={40} />
                        </button>
                        <p>{category.replace("-", " ")}</p>
                    </div>
                )
            })}
        </>
    )
}