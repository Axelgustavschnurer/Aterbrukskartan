import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import DualRangeSlider from "../dualSlider/dualSlider";
import { RecycleFilter } from "@/types";
import { yearLimitsRecycle } from "@/pages/aterbruk";
import {
  createLookingForFilter,
  createAvailableFilter,
  createProjectTypeFilter,
} from "@/components/aside/recycleSidebar";

import { Button, Collapse } from "@nextui-org/react";
import styles from '@/components/aside/aside.module.css'
import { Data } from "@/session";
import { logoutFunction } from "../logout";

export default function MobileSidebar({ setFilter, currentMap, user }: { setFilter: Function, currentMap: string, user: Data['user'] }) {
  const [isOpen, setOpen] = useState(true);

  // List of all pins in the database
  const [mapData, setMapData] = useState([]);

  // State of the year slider
  const [years, setYears] = useState([] as number[]);

  // State of the month slider
  const [months, setMonths] = useState([] as number[]);

  // List of all active filters for the field `projectType`
  const [projectType, setProjectType] = useState([] as string[]);

  // List of all active filters for the field `lookingForMaterials`
  const [lookingForMaterials, setLookingForMaterials] = useState([] as string[]);

  // List of all active filters for the field `availableMaterials`
  const [availableMaterials, setAvailableMaterials] = useState([] as string[]);

  // List of all active filters for the field `organisation`
  const [organisation, setOrganisation] = useState([] as string[]);

  // Boolean to indicate if only inactive pins should be shown
  const [showInactive, setShowInactive] = useState(false as boolean);

  // Boolean to indicate if only pins with attachments should be shown
  const [showAttachment, setShowAttachment] = useState(false as boolean);

  // State to check when the year slider are at it's default values
  const [yearSliderDefault, setYearSliderDefault] = useState(true as boolean);

  // State to check when the month slider are at it's default values
  const [monthSliderDefault, setMonthSliderDefault] = useState(true as boolean);

  // State of when to reset the range sliders
  const [sliderReset, setSliderReset] = useState(false as boolean);

  // State of when the reset button should be active
  const [disableReset, setDisableReset] = useState({
    projectType: true,
    lookingForMaterials: true,
    availableMaterials: true,
    organisation: true,
  } as any);

  // Runs fetchData function on component mount
  useEffect(() => {
    /** Fetches data from the database */
    const fetchData = async () => {
      const response = await fetch("/api/recycle");
      const data = await response.json();
      setMapData(data);
    };
    fetchData();
  }, [currentMap]);

  // Closes the sidebar when the user navigates to a new page
  const router = useRouter();
  useEffect(() => {
    const closeMenu = () => isOpen && setOpen(false);
    router.events.on("routeChangeStart", closeMenu);
    return () => {
      router.events.off("routeChangeStart", closeMenu);
    };
  }, [isOpen, router]);

  // Updates filter state when the user interacts with any of the filter components
  useEffect(() => {
    setFilter({
      projectType: projectType,
      years: years,
      months: months,
      lookingForCategories: lookingForMaterials,
      availableCategories: availableMaterials,
      organisation: organisation,
      showInactive: showInactive,
      attachment: showAttachment,
    } as RecycleFilter);
  }, [
    projectType,
    years,
    months,
    lookingForMaterials,
    availableMaterials,
    organisation,
    setFilter,
    currentMap,
    showInactive,
    showAttachment,
  ]);

  /**
   * Creates checkboxes for all the different organisations in the database
   */
  const createOrganisationFilter = () => {

    let mappedData = mapData.map((pin: any) => pin.mapItem.organisation);
    let filteredData = mappedData
      .filter(
        (pin: any, index: any) =>
          mappedData.indexOf(pin) === index && !!mappedData[index]
      )
      .sort();
    return (
      <>
        <Collapse title="Organisation" divider={false} subtitle="Tryck för att expandera / minimera">
          {filteredData.map((pin: any) => {
            return (
              <div key={pin} className={styles.input}>
                <input
                  id={pin}
                  name={pin}
                  type="checkbox"
                  onChange={(e) => {
                    // If the checkbox is now unchecked and the organisation is in the organisation array, remove it from the array
                    if (
                      organisation.includes(e.target.name) &&
                      !e.target.checked
                    ) {
                      setOrganisation(
                        organisation.filter(
                          (item: any) => item !== e.target.name
                        )
                      );
                      // If the array only contains one item or less, disable the reset button. We have to check check if the array has at least one item because the state is updated on the next render
                      if (organisation.length <= 1) {
                        setDisableReset({
                          ...disableReset,
                          organisation: true,
                        });
                      }
                    }
                    // If the checkbox is now checked and the organisation is not in the organisation array, add it to the array
                    else if (
                      !organisation.includes(e.target.name) &&
                      e.target.checked
                    ) {
                      setOrganisation([...organisation, e.target.name]);
                      // Enable the reset button when a filter is active
                      setDisableReset({ ...disableReset, organisation: false });
                    }
                  }}
                />
                <label htmlFor={pin} style={{ margin: "0", }}>{pin}</label>
              </div>
            );
          })}
        </Collapse>
      </>
    );
  };

  return (
    <>
      <input type="checkbox" id="navi-toggle" className={styles.checkbox} />
      <label htmlFor="navi-toggle" className={styles.button}>
        <span className={styles.icon}>&nbsp;</span>
      </label>
      <div className={styles.background}></div>

      <nav className={styles.phoneWrapper}>
        <section className="padding-block-200">
          <section>
            {!user && (
              <Link href="/login" className='flex align-items-center gap-100 padding-50 navbar-link'>
                Logga in
                <Image src="/images/adminIcons/login.svg" alt='Logga in' width={24} height={24} />
              </Link>
            )}
          </section>

          <section className='flex-grow-100 padding-block-100'>
            {/* Buttons leading to other pages where one can add/edit projects to the database */}
            {(user?.isAdmin || user?.isRecycler) && (
              <>
                <Link href='/aterbruk/newPost' className='flex align-items-center gap-100 padding-50 navbar-link'>
                  <Image src="/images/adminIcons/addToMap.svg" alt='Lägg till nytt projekt' width={24} height={24} />
                  Skapa nytt inlägg
                </Link>

                <Link href='/aterbruk/editPost' className='flex align-items-center gap-100 padding-50 navbar-link'>
                  <Image src="/images/adminIcons/edit.svg" alt='Redigera projekt' width={24} height={24} />
                  Redigera inlägg
                </Link>
              </>
            )}

            {/* Buttons leading to the admin pages */}
            {user?.isAdmin && (
              <>
                <Link href='/aterbruk/addUser' className='flex align-items-center gap-100 padding-50 navbar-link'>
                  <Image src="/images/adminIcons/addUser.svg" alt='Lägg till ny användare' width={24} height={24} />
                  Skapa ny användare
                </Link>

                <Link href='/admin/addUser' className='flex align-items-center gap-100 padding-50 navbar-link'>
                  <Image src="/images/adminIcons/editUser.svg" alt='Redigera användare' width={24} height={24} />
                  Redigera användare
                </Link>
              </>
            )}
          </section>

          <section>
            <Link href='https://github.com/STUNS-Uppsala/Aterbrukskartan' target='_blank' className='flex align-items-center gap-100 padding-50 navbar-link'>
              <Image src="/github-mark.svg" alt='GitHub logo' width={24} height={24} />
              Se koden på GitHub
            </Link>

            {/* Logout button */}
            {user && (
              <button type="button" onClick={logoutFunction} className='flex align-items-center padding-50 gap-100' style={{ width: '100%', fontSize: '1rem', fontWeight: '500', backgroundColor: 'transparent' }}>
                <Image src="/images/adminIcons/logout.svg" alt='Logga ut' width={24} height={24} />
                Logga ut
              </button>
            )}
          </section>
        </section>

        <div className="padding-block-100">
          {/* Buttons for choosing project types to filter by */}
          <div className={styles.filterButtons}>
            {createProjectTypeFilter(projectType, setProjectType, disableReset, setDisableReset)}
          </div>

          <h3>År</h3>
          {/* Range slider for year filter */}
          <div>
            <DualRangeSlider
              min={yearLimitsRecycle.min}
              max={yearLimitsRecycle.max}
              onChange={({ min, max }: any) => {
                if (years.includes(yearLimitsRecycle.min) && years.includes(yearLimitsRecycle.max)
                ) {
                  setYearSliderDefault(true);
                } else {
                  setYearSliderDefault(false);
                }

                if (!(years.includes(min) && years.includes(max)) || (min === max && !(years[0] === min && years[1] === max))) {
                  setYears([min, max]), setSliderReset(false);
                }
              }}
              reset={sliderReset}
            />
          </div>

          <h3>Månad</h3>
          <div>
            <DualRangeSlider
              min={1}
              max={12}
              onChange={({ min, max }: any) => {
                if (months.includes(1) && months.includes(12)) {
                  setMonthSliderDefault(true);
                } else {
                  setMonthSliderDefault(false);
                }

                if (!(months.includes(min) && months.includes(max)) || (min === max && !(months[0] === min && months[1] === max))) {
                  setMonths([min, max]), setSliderReset(false);
                }
              }}
              reset={sliderReset}
            />
          </div>

          {/* Checkboxes for filtering materials and organisations */}
          <form>
            <span>
              <h3>Bilaga</h3>
              <div className={styles.input}>
                <input
                  id="showAttached"
                  name="showAttached"
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShowAttachment(true);
                    } else {
                      setShowAttachment(false);
                    }
                  }}
                />
                <label htmlFor="showAttached" style={{ margin: "0", }}>Visa bara inlägg med bilaga</label>
              </div>
              <h3>Erbjuds</h3>{" "}
              {createAvailableFilter(
                mapData,
                availableMaterials,
                setAvailableMaterials,
                disableReset,
                setDisableReset
              )}{" "}
              <h3>Sökes</h3>{" "}
              {createLookingForFilter(
                mapData,
                lookingForMaterials,
                setLookingForMaterials,
                disableReset,
                setDisableReset
              )}
            </span>
            {createOrganisationFilter()}

            {/* Admin-only button to filter for disabled pins */}
            {user && user.isAdmin && (
              <>
                <div className={styles.input}>
                  <input
                    id="showDisabled"
                    name="showDisabled"
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setShowInactive(true);
                      } else {
                        setShowInactive(false);
                      }
                    }}
                  />
                  <label htmlFor="showDisabled" style={{ margin: "0", }}>Visa bara inaktiva inlägg</label>
                </div>
              </>
            )
            }
          </form>

          {/* Button for clearing the current filter. Disabled when no filter is active */}
          <div>
            <Button
              id={styles.clearBtn}
              css={{ width: "100%" }}
              disabled={
                disableReset.projectType &&
                disableReset.lookingForMaterials &&
                disableReset.availableMaterials &&
                disableReset.organisation &&
                !showInactive &&
                !showAttachment &&
                yearSliderDefault &&
                monthSliderDefault
              }
              onPress={() => {
                setProjectType([]);
                setSliderReset(true);
                setLookingForMaterials([]);
                setAvailableMaterials([]);
                setOrganisation([]);
                setShowInactive(false);
                setShowAttachment(false);
                setDisableReset({
                  projectType: true,
                  lookingForMaterials: true,
                  availableMaterials: true,
                  organisation: true,
                });

                let checkboxes = document.querySelectorAll(
                  "input[type=checkbox]:not([id=navi-toggle])"
                );
                checkboxes.forEach((checkbox: any) => {
                  checkbox.checked = false;
                });
              }}
            >
              Rensa filter
            </Button>
          </div>
        </div>
      </nav >
    </>
  )
}