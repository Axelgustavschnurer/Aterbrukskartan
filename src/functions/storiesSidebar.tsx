import React from "react";
import Image from "next/image";
import styles from "../styles/sidebar.module.css";
import { educationalPrograms } from "@/pages/stories/newStory";
import { Button } from "@nextui-org/react";

/**
 * Creates buttons for all the categories defined in the object `categories` in this function.
 *
 * The `categories` object also contains a mapping from category name to image name.
 *
 * TODO: Should maybe import an array of categories from somewhere, but that would mess upp the image linking used here
 * @param storyCategory Array of strings containing the currently active category filters
 * @param setStoryCategory Function to set the `storyCategory` state
 */
export function createCategoryFilter(
  storyCategory: any,
  setStoryCategory: any,
  disableReset: any,
  setDisableReset: any
) {
  let categories = {
    "Bygg-och-anläggning": "building",
    "Grön-energi": "solar",
    "Social-hållbarhet": "social",
    Mobilitet: "car",
    Elnät: "powerline",
    Bioteknik: "dna",
    Miljöteknik: "earth",
    Energilagring: "battery",
    "Agrara-näringar": "leaf",
    Livsmedel: "carrot",
    Hälsa: "heartbeat",
    "Vatten-och-avlopp": "water",
  };

  return (
    <>
      {/* Creates a button for each category in the `categories` object. */}
      {Object.keys(categories).map((category: any) => {
        return (
          <div className={styles.alignCategories} key={category}>
            <div className={styles.categoryContainer} >
              <Button
                id={styles[category]}
                className={styles.categoryBtn}
                css={{ width: "50px", height: "50px" }}
                rounded
                auto
                icon={<Image
                  src={
                    "/images/categories/" +
                    categories[category as keyof typeof categories] +
                    ".svg"
                  }
                  alt={category}
                  width={40}
                  height={40}
                />}
                value={category.replaceAll("-", " ")}
                onPress={(e: any) => {
                  // If category is already in the storyCategory array, remove it
                  if (storyCategory.includes(e.target.value)) {
                    // If the array only contains one item or less, disable the reset button. We have to check check if the array has at least one item because the state is updated on the next render
                    if (storyCategory.length <= 1) {
                      setDisableReset({ ...disableReset, storyCategory: true });
                    }
                    setStoryCategory(
                      storyCategory.filter(
                        (item: any) => item !== e.target.value
                      )
                    );
                  }
                  // Otherwise, add it
                  else {
                    setStoryCategory([...storyCategory, e.target.value]);
                    setDisableReset({ ...disableReset, storyCategory: false });
                  }
                }}
              >
                {/* Image is imported from the /images/categories folder, image name is mapped to the category name in the `categories` object. */}

              </Button>
              <p>{category.replaceAll("-", " ")}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}

/**
 * Creates checkboxes for all the misc filters defined in the array `options` in this function.
 * All parameters are state booleans that are used to filter the stories based on conrresponding contents.
 */
export function createMiscFilter(
  hasReport: any,
  setHasReport: any,
  hasVideo: any,
  setHasVideo: any,
  hasCase: any,
  setHasCase: any,
  isEnergy: any,
  setIsEnergy: any
) {
  let options = ["Rapport", "Videos", "Cases", "Energy Story"];
  return (
    <>
      {/* Creates a checkbox for each item in the `options` array. */}
      {options.map((item: any) => {
        return (
          <div className={styles.inputGroup} key={item}>
            <input
              id={item}
              name={item}
              type="checkbox"
              onChange={(e) => {
                // If the checkbox is now unchecked and the item is in the corresponding state boolean, set the state boolean to false
                if (item === "Rapport" && hasReport !== e.target.checked) {
                  setHasReport(e.target.checked);
                } else if (item === "Videos" && hasVideo !== e.target.checked) {
                  setHasVideo(e.target.checked);
                } else if (item === "Cases" && hasCase !== e.target.checked) {
                  setHasCase(e.target.checked);
                } else if (
                  item === "Energy Story" &&
                  isEnergy !== e.target.checked
                ) {
                  setIsEnergy(e.target.checked);
                }
              }}
            />
            <label htmlFor={item}>{item}</label>
          </div>
        );
      })}
    </>
  );
}

/**
 * Creates checkboxes for all the educational programs defined in the array `educationalPrograms` defined in the file `newStory.tsx`.
 * @param educationalProgram Array of strings containing the currently active educational program filters.
 * @param setEducationalProgram Function to set the `educationalProgram` state.
 */
export function createEducationalFilter(
  educationalProgram: any,
  setEducationalProgram: any,
  disableReset: any,
  setDisableReset: any
) {
  let programs = educationalPrograms;
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
                if (
                  educationalProgram.includes(e.target.name) &&
                  !e.target.checked
                ) {
                  setEducationalProgram(
                    educationalProgram.filter(
                      (item: any) => item !== e.target.name
                    )
                  );
                  setDisableReset({
                    ...disableReset,
                    educationalProgram: true,
                  });
                }
                // If the checkbox is now checked and the program is not in the educationalProgram array, add it to the array
                else if (
                  !educationalProgram.includes(e.target.name) &&
                  e.target.checked
                ) {
                  setEducationalProgram([...educationalProgram, e.target.name]);
                  setDisableReset({
                    ...disableReset,
                    educationalProgram: false,
                  });
                }
              }}
            />
            <label htmlFor={program}>{program}</label>
          </div>
        );
      })}
    </>
  );
}
