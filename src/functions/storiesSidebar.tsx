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

/**
 * Stuff
 */
export function createEducationalFilter(educationalProgram: any, setEducationalProgram: any) {
    let programs = ["Civilingenjör", "Högskoleingenjör", "Agronom", "Kandidatprogram"]
    return (
        <>
            {programs.map((program: any) => {
                return (
                    <div className={styles.inputGroup} key={program}>
                        <input
                            id={program}
                            name={program}
                            type="checkbox"
                            onChange={(e) => {
                                // If the checkbox is now checked and the program is not in the educationalProgram array, add it to the array
                                if (educationalProgram.includes(e.target.name) && !e.target.checked) {
                                    setEducationalProgram(educationalProgram.filter((item: any) => item !== e.target.name))
                                    console.log("remove", educationalProgram);

                                }
                                // If the checkbox is now unchecked and the program is in the educationalProgram array, remove it from the array
                                else if (!educationalProgram.includes(e.target.name) && e.target.checked) {
                                    setEducationalProgram([...educationalProgram, e.target.name])
                                    console.log("add", educationalProgram);

                                }
                                console.log(educationalProgram, "but no pass?", "checked?", e.target.checked, "includes?", educationalProgram.includes(e.target.name));

                            }}
                        />
                        <label htmlFor={program}>{program}</label>
                    </div>
                )
            })}
        </>
    )
}