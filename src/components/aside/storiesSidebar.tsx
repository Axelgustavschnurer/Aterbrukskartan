import React from "react";
import Image from "next/image";
import styles from "./aside.module.css";
import { basePrograms, educationalPrograms } from "@/pages/stories/newStory";
import { Button } from "@nextui-org/react";
import setFirstLetterCapital from "../../functions/setFirstLetterCapital";

/**
 * Contains all the allowed categories for stories (not including "Övrigt", as it's not a real category),
 * and the names of the corresponding images in the /images/categoriesStories  folder.
 */
export const storyCategories = {
  "Bygg-och-anläggning": "building",
  "Grön-energi": "solar",
  Hållbarhet: "sustain",
  "Social-hållbarhet": "social",
  Mobilitet: "car",
  Elnät: "powerline",
  "Hälsa-och-bioteknik": "heartbeat",
  Miljöteknik: "earth",
  Energilagring: "battery",
  "Agrara-näringar": "leaf",
  Livsmedel: "carrot",
  "Vatten-och-avlopp": "water",
};

/**
 * Creates buttons for all the categories defined in the object `categories` in this function.
 *
 * The `categories` object also contains a mapping from category name to image name.
 *
 * TODO: Should maybe import an array of categories from somewhere, but that would mess upp the image linking used here
 * @param storyCategory Array of strings containing the currently active category filters
 * @param setStoryCategory Function to set the `storyCategory` state
 * @param disableReset Object containing booleans for each filter type. If true, the reset button is disabled
 * @param setDisableReset Function to set the `disableReset` state
 */
export function createCategoryFilter(
  storyCategory: string[],
  setStoryCategory: any,
  disableReset: any,
  setDisableReset: any
) {
  // Object containing all the categories and their corresponding image names
  let categories = { ...storyCategories, Övrigt: "other" };

  return (
    <>
      {/* Creates a button for each category in the `categories` object. */}
      {Object.keys(categories).map((category: any) => {

        /* Styling for inactive/active buttons */
        const isCategoryActive = storyCategory.includes(category.replaceAll("-", " "));

        const buttonStyle = {
          background: isCategoryActive ? "" : "#808080",
          transition: "unset",
        };

        if (storyCategory.length === 0) {
          // Override styling when the list is completely empty
          buttonStyle.background = '';
        }

        return (
          <div key={category}>
            <Button
              id={styles[category]}
              className={styles.categoryBtn}
              style={buttonStyle}
              css={{ width: "100%", height: "75px"}}
              auto
              icon={
                <Image
                  src={
                    "/images/categoriesStories/" +
                    categories[category as keyof typeof categories] +
                    ".svg"
                  }
                  alt={category}
                  width={40}
                  height={40}
                />
              }
              // Replace all dashes with spaces in the category name for database query
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
            {/* Replace all dashes with spaces in the category name for display */}
            <p>{category.replaceAll("-", " ")}</p>
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
  hasReport: boolean,
  setHasReport: any,
  hasVideo: boolean,
  setHasVideo: any,
  hasCase: boolean,
  setHasCase: any,
  hasOpenData: boolean,
  setHasOpenData: any,
  isRealStory: boolean,
  setIsRealStory: any,
  hasSolarData: boolean,
  setHasSolarData: any
) {
  let options = [
    "Rapport",
    "Videos",
    "Cases",
    "Öppna data",
    "Stories",
    "Energiportalen",
  ];
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
                } else if (item === "Öppna data" && hasOpenData !== e.target.checked) {
                  setHasOpenData(e.target.checked);
                } else if (item === "Stories" && isRealStory !== e.target.checked) {
                  setIsRealStory(e.target.checked);
                } else if (item === "Energiportalen" && hasSolarData !== e.target.checked) {
                  setHasSolarData(e.target.checked);
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
 * @param disableReset Object containing booleans for each filter type. If true, the reset button is disabled
 * @param setDisableReset Function to set the `disableReset` state
 */
export function createEducationalFilter(
  educationalProgram: string[],
  setEducationalProgram: any,
  disableReset: any,
  setDisableReset: any,
  databasePrograms: string[]
) {
  let programs = basePrograms.concat(databasePrograms);
  let formattedPrograms = programs.map((program: string) => !!program ? setFirstLetterCapital(program.toLowerCase()) : "");
  programs = formattedPrograms
    .filter(
      (program: any, index: any) =>
        formattedPrograms.indexOf(program) === index && !!formattedPrograms[index]
    )
    .sort();
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

/**
 * Creates checkboxes for all the categories defined in the array `categories` in this function.
 * @param storyCategory Array of strings containing the currently active category filters.
 * @param setStoryCategory Function to set the `storyCategory` state.
 * @param disableReset Object containing booleans for each filter type. If true, the reset button is disabled
 * @param setDisableReset Function to set the `disableReset` state
 * @returns JSX.Element
 */
export function createMobileCategories(
  storyCategory: string[],
  setStoryCategory: any,
  disableReset: any,
  setDisableReset: any
) {
  let categories = [...Object.keys(storyCategories), "Övrigt"];

  return (
    <>
      {categories.map((category: any) => {
        return (
          <div className={styles.inputGroup} key={category}>
            <input
              id={category}
              name={category.replaceAll("-", " ")}
              type="checkbox"
              onChange={(e) => {
                // If the checkbox is now unchecked and the category is in the storyCategory array, remove it
                if (storyCategory.includes(e.target.name) && !e.target.checked) {
                  setStoryCategory(
                    storyCategory.filter(
                      (item: any) => item !== e.target.name
                    )
                  );
                  setDisableReset({ ...disableReset, storyCategory: true });
                }
                // If the checkbox is now checked and the category is not in the storyCategory array, add it
                else if (
                  !storyCategory.includes(e.target.name) &&
                  e.target.checked
                ) {
                  setStoryCategory([...storyCategory, e.target.name]);
                  setDisableReset({ ...disableReset, storyCategory: false });
                }
              }}
            />
            <label htmlFor={category}>{category.replaceAll("-", " ")}</label>
          </div>
        );
      })}
    </>
  );
}