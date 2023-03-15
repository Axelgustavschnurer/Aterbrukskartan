import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Filter } from "@/types";
import Image from "next/image";
import { yearLimits } from "@/pages/aterbruk";
import styles from "../styles/sidebar.module.css";

/**
* Creates buttons for all the project categories defined in the array `categories` in this function
*/
export function createProjectTypeFilter(projectType: any, setProjectType: any) {
let categories = [
    "Rivning",
    "Nybyggnation",
    "Ombyggnation",
]
    return (
        <>
        {categories.map((category: any) => {
            return (
            <div className={styles.alignBtn} key={category}>
                <button
                id={styles[category]}
                value={category}
                onClick={(e: any) => {
                    if (projectType.includes(e.currentTarget.value)) {
                    setProjectType(projectType.filter((item: any) => item !== e.currentTarget.value))
                    } else {
                    setProjectType([...projectType, e.currentTarget.value])
                    }
                }}
                >
                <Image src={"/images/" + category.toLowerCase() + ".svg"} alt={category} width={40} height={40} />
                </button>
                <p>{category}</p>
            </div>
            )
        })}
        </>
    )
}

/**
 * Returns an array of all the different material categories in the database
 */
export function getAllMaterialCategories(mapData: any) {
    // List of all strings in the availableMaterials and lookingForMaterials fields
    let unsplitMaterials: string[] = []
    mapData.map((pin: any) => {
        if (pin.availableMaterials) {
        unsplitMaterials.push(pin.availableMaterials)
        }
        if (pin.lookingForMaterials) {
        unsplitMaterials.push(pin.lookingForMaterials)
        }
    })

    // Splits the strings into arrays and flattens them into one array
    let splitMaterials: string[] = []
    unsplitMaterials.map((material: any) => {
        splitMaterials.push(...material.split(',').map((item: any) => item.trim()))
    })

    // Removes duplicates and sorts the array
    let filteredMaterials = splitMaterials.filter((data: any, index: any) => splitMaterials.indexOf(data) === index && data).sort()

    return filteredMaterials
}

/**
 * Creates checkboxes for all the different lookingForMaterials categories in the database
 */
export function createLookingForFilter(getAllMaterialCategories: any, lookingForMaterials: any, setLookingForMaterials: any) {
    let categories = getAllMaterialCategories()
    return (
        <>
        {categories.map((category: any) => {
            return (
            <div className={styles.inputGroup} key={category + "Sökes"}>
                <input
                id={category + "Sökes"}
                name={category + "Sökes"}
                type="checkbox"
                onChange={(e) => {
                    // If the checkbox is now checked and the category is not in the lookingForMaterials array, add it to the array
                    if (lookingForMaterials.includes(e.target.name.replace('Sökes', '')) && !e.target.checked) {
                    setLookingForMaterials(lookingForMaterials.filter((item: any) => item !== e.target.name.replace('Sökes', '')))
                    }
                    // If the checkbox is now unchecked and the category is in the lookingForMaterials array, remove it from the array
                    else if (!lookingForMaterials.includes(e.target.name.replace('Sökes', '')) && e.target.checked) {
                    setLookingForMaterials([...lookingForMaterials, e.target.name.replace('Sökes', '')])
                    }
                }}
                />
                <label htmlFor={category + "Sökes"}>{category}</label>
            </div>
            )
        })}
        </>
    )
}

/**
 * Creates checkboxes for all the different availableMaterials categories in the database
 */
export function createAvailableFilter(getAllMaterialCategories: any, availableMaterials: any, setAvailableMaterials: any) {
    let categories = getAllMaterialCategories()
    return (
        <>
        {categories.map((category: any) => {
            return (
            <div className={styles.inputGroup} key={category + "Erbjuds"}>
                <input
                id={category + "Erbjuds"}
                name={category + "Erbjuds"}
                type="checkbox"
                onChange={(e) => {
                    // If the checkbox is now checked and the category is not in the availableMaterials array, add it to the array
                    if (availableMaterials.includes(e.target.name.replace('Erbjuds', '')) && !e.target.checked) {
                    setAvailableMaterials(availableMaterials.filter((item: any) => item !== e.target.name.replace('Erbjuds', '')))
                    }
                    // If the checkbox is now unchecked and the category is in the availableMaterials array, remove it from the array
                    else if (!availableMaterials.includes(e.target.name.replace('Erbjuds', '')) && e.target.checked) {
                    setAvailableMaterials([...availableMaterials, e.target.name.replace('Erbjuds', '')])
                    }
                }}
                />
                <label htmlFor={category + "Erbjuds"}>{category}</label>
            </div>
            )
        })}
        </>
    )
}