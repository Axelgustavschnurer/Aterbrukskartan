import React from "react";
import Image from "next/image";
import styles from "../styles/sidebar.module.css";
import { educationalPrograms } from "@/pages/stories/newStory";

/**
 * Creates buttons for all the categories defined in the object `categories` in this function.
 * 
 * The `categories` object also contains a mapping from category name to image name.
 * 
 * TODO: Should maybe import an array of categories from somewhere, but that would mess upp the image linking used here
 * @param storyCategory Array of strings containing the currently active category filters
 * @param setStoryCategory Function to set the `storyCategory` state
 */
export function createCategoryFilter(storyCategory: any, setStoryCategory: any) {
  let categories = {
    "Solel": "solar",
    "Energilagring": "battery",
    "Hållbarhet": "leaf",
    "Energi": "lightbulb",
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
    "Effekt": "lightning",
    "Värme": "fire",
    "Cleantech": "gears",
    "Vindkraft": "windmill",
    "Kyla": "snowflake"
  }
  return (
    <>
    {/* Creates a button for each category in the `categories` object. */}
      {Object.keys(categories).map((category: any) => {
        return (
          <div className={styles.alignCategories} key={category}>
            <button
              id={styles[category]}
              className={styles.categoryBtn}
              value={category.replace("-", " ")}
              onClick={(e: any) => {
                if (storyCategory.includes(e.currentTarget.value)) {
                  setStoryCategory(storyCategory.filter((item: any) => item !== e.currentTarget.value))
                } else {
                  setStoryCategory([...storyCategory, e.currentTarget.value])
                }
              }}
            >
              {/* Image is imported from the /images/categories folder, image name is mapped to the category name in the `categories` object. */}
              <Image src={"/images/categories/" + categories[category as keyof typeof categories] + ".svg"} alt={category} width={40} height={40} />
            </button>
            <p>{category.replace("-", " ")}</p>
          </div>
        )
      })}
    </>
  )
}

export function createMiscFilter(hasReport: any, setHasReport: any, hasVideo: any, setHasVideo: any, hasCase: any, setHasCase: any, isEnergy: any, setIsEnergy: any) {
  let options = ["Rapport", "Videos", "Cases", "Energy Story"]
  return (
    <>
      {options.map((item: any) => {
        return (
          <div className={styles.inputGroup} key={item}>
            <input
              id={item}
              name={item}
              type="checkbox"
              onChange={(e) => {
                if (item === "Rapport" && hasReport !== e.target.checked) {
                  setHasReport(e.target.checked)
                  } else if (item === "Videos" && hasVideo !== e.target.checked) {
                    setHasVideo(e.target.checked)
                    } else if (item === "Cases" && hasCase !== e.target.checked) {
                      setHasCase(e.target.checked)
                      } else if (item === "Energy Story" && isEnergy !== e.target.checked) {
                        setIsEnergy(e.target.checked)
                        }
              }}
            />
            <label htmlFor={item}>{item}</label>
          </div>
        )
      })}
    </>
  )
}

/**
 * Creates checkboxes for all the educational programs defined in the array `educationalPrograms` defined in the file `newStory.tsx`.
 * @param educationalProgram Array of strings containing the currently active educational program filters.
 * @param setEducationalProgram Function to set the `educationalProgram` state.
 */
export function createEducationalFilter(educationalProgram: any, setEducationalProgram: any) {
  let programs = educationalPrograms
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
                // If the checkbox is now unchecked and the program is in the educationalProgram array, remove it from the array
                if (educationalProgram.includes(e.target.name) && !e.target.checked) {
                  setEducationalProgram(educationalProgram.filter((item: any) => item !== e.target.name))
                }
                // If the checkbox is now checked and the program is not in the educationalProgram array, add it to the array
                else if (!educationalProgram.includes(e.target.name) && e.target.checked) {
                  setEducationalProgram([...educationalProgram, e.target.name])
                }
              }}
            />
            <label htmlFor={program}>{program}</label>
          </div>
        )
      })}
    </>
  )
}