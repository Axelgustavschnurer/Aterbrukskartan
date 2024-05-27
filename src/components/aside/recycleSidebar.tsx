import React from "react";
import Image from "next/image";
import styles from "./aside.module.css";
import { Button } from "@nextui-org/react";
import { DeepRecycle } from "@/types";
import { categories, projectTypes } from "@/pages/aterbruk/newPost";

/**
 * Creates buttons for all the project categories defined in the array `categories` in this function
 * @param projectType Array of strings containing the currently active project type filters
 * @param setProjectType Function to set the `projectType` state
 * @param disableReset Object containing booleans for each filter type. If true, the reset button is disabled
 * @param setDisableReset Function to set the `disableReset` state
 */
export function createProjectTypeFilter(
  projectType: string[],
  setProjectType: any,
  disableReset: any,
  setDisableReset: any
) {
  let categories = projectTypes;
  return (  
    <>
      {categories.map((category: any) => {

      const isCategoryActive = projectType.includes(category.replaceAll("-", " "));
            
      const buttonStyle = {
        background: isCategoryActive ? "" : "#808080",
        transition: "unset",
      };

      if (projectType.length === 0) {
        // Override styling when the list is completely empty
        buttonStyle.background = ''; // You can use a different color or style here
      }

        return (
          <div className={styles.alignCategoriesRecycle} key={category}>
            <div className={styles.categoryContainerRecycle} >
              <Button
                id={styles[category]}
                className={styles.categoryBtn}
                style={buttonStyle}
                css={{ width: "100%", height: "75px", borderRadius: ".5em"}}
                auto
                icon={<Image
                  src={"/images/categoriesÅterbruk/" + category.toLowerCase() + ".svg"}
                  alt={category}
                  width={40}
                  height={40}
                />}
                value={category}
                onPress={(e: any) => {
                  // If category is already in the projectType array, remove it
                  if (projectType.includes(e.target.value)) {
                    // If the array only contains one item or less, disable the reset button. We have to check check if the array has at least one item because the state is updated on the next render
                    if (projectType.length <= 1) {
                      setDisableReset({ ...disableReset, projectType: true });
                    }
                    setProjectType(
                      projectType.filter(
                        (item: any) => item !== e.target.value
                      )
                    );
                  }
                  // Otherwise, add it
                  else {
                    setProjectType([...projectType, e.target.value]);
                    setDisableReset({ ...disableReset, projectType: false });
                  }
                }}
              >
              </Button>
              <p>{category}</p>
            </div>
          </div>
        );
      })}
    </>
  );
} 

/**
  * Creates checkboxes for all the different lookingForMaterials categories in the database
  * @param mapData Array of objects containing all the data from the database
  * @param lookingForMaterials Array of strings containing the currently active lookingForMaterials filters
  * @param setLookingForMaterials Function to set the `lookingForMaterials` state
  * @param disableReset Object containing booleans for each filter type. If true, the reset button is disabled
  * @param setDisableReset Function to set the `disableReset` state
  * @returns JSX.Element
*/
export function createLookingForFilter(
  mapData: DeepRecycle[],
  lookingForMaterials: string[],
  setLookingForMaterials: any,
  disableReset: any,
  setDisableReset: any
) {
  let cat = categories;
  return (
    <>
      {cat.map((category: any) => {
        return (
          <div className={styles.input} key={category + "Sökes"}>
            <input
              id={category + "Sökes"}
              name={category + "Sökes"}
              type="checkbox"
              onChange={(e) => {
                // If the checkbox is now unchecked and the category is in the lookingForMaterials array, remove it from the array
                if (
                  lookingForMaterials.includes(
                    e.target.name.replace("Sökes", "")
                  ) &&
                  !e.target.checked
                ) {
                  setLookingForMaterials(
                    lookingForMaterials.filter(
                      (item: any) => item !== e.target.name.replace("Sökes", "")
                    )
                  );
                  if (lookingForMaterials.length <= 1) {
                    setDisableReset({
                      ...disableReset,
                      lookingForMaterials: true,
                    });
                  }
                }
                // If the checkbox is now checked and the category is not in the lookingForMaterials array, add it to the array
                else if (
                  !lookingForMaterials.includes(
                    e.target.name.replace("Sökes", "")
                  ) &&
                  e.target.checked
                ) {
                  setLookingForMaterials([
                    ...lookingForMaterials,
                    e.target.name.replace("Sökes", ""),
                  ]);
                  setDisableReset({
                    ...disableReset,
                    lookingForMaterials: false,
                  });
                }
              }}
            />
            <label htmlFor={category + "Sökes"} style={{margin: "0",}}>{category}</label>
          </div>
        );
      })}
    </>
  );
}

/**
 * Creates checkboxes for all the different availableMaterials categories in the database
 * @param mapData Array of objects containing all the data from the database
 * @param availableMaterials Array of strings containing the currently active availableMaterials filters
 * @param setAvailableMaterials Function to set the `availableMaterials` state
 * @param disableReset Object containing booleans for each filter type. If true, the reset button is disabled
 * @param setDisableReset Function to set the `disableReset` state
 * @returns JSX.Element
 */
export function createAvailableFilter(
  mapData: DeepRecycle[],
  availableMaterials: string[],
  setAvailableMaterials: any,
  disableReset: any,
  setDisableReset: any
) {
  let cat = categories;
  return (
    <>
      {cat.map((category: any) => {
        return (
          <div className={styles.input} key={category + "Erbjuds"}>
            <input
              id={category + "Erbjuds"}
              name={category + "Erbjuds"}
              type="checkbox"
              onChange={(e) => {
                // If the checkbox is now unchecked and the category is in the availableMaterials array, remove it from the array
                if (
                  availableMaterials.includes(
                    e.target.name.replace("Erbjuds", "")
                  ) &&
                  !e.target.checked
                ) {
                  setAvailableMaterials(
                    availableMaterials.filter(
                      (item: any) =>
                        item !== e.target.name.replace("Erbjuds", "")
                    )
                  );
                  if (availableMaterials.length <= 1) {
                    setDisableReset({
                      ...disableReset,
                      availableMaterials: true,
                    });
                  }
                }
                // If the checkbox is now checked and the category is not in the availableMaterials array, add it to the array
                else if (
                  !availableMaterials.includes(
                    e.target.name.replace("Erbjuds", "")
                  ) &&
                  e.target.checked
                ) {
                  setAvailableMaterials([
                    ...availableMaterials,
                    e.target.name.replace("Erbjuds", ""),
                  ]);
                  setDisableReset({
                    ...disableReset,
                    availableMaterials: false,
                  });
                }
              }}
            />
            <label htmlFor={category + "Erbjuds"} style={{margin: "0",}}>{category}</label>
          </div>
        );
      })}
    </>
  );
}
