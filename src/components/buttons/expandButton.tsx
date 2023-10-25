import { useRouter } from "next/router";
import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";

import styles from "./buttons.module.css";

// Conditionally renders a child element based on button press (do this without a useeffectif possible)
export default function ExpandButton({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  // Sets the state to the opposite of what it is
  const toggleMenu = () => {
    setOpen(!isOpen);
  };

  // Closes the child element if the user clicks the close button
  useEffect(() => {
    const closeMenu = () => isOpen && setOpen(false);
    router.events.on("routeChangeStart", closeMenu);
    return () => {
      router.events.off("routeChangeStart", closeMenu);
    };
  }, [isOpen, router]);

  return (
    <>
      {isOpen && (
        <div  style={{position: "absolute", bottom: "0", left: "0", width: "100%"}}>
          <div className={styles.footerClose} style={{position: "relative", top: "0"}} >
            <button
              id={styles.hideBtn}
              onClick={toggleMenu}>
              <Image src="/downArrow.svg" alt="Closing arrow" width={20} height={20} />
            </button>
          </div>
          {children}
        </div>
      )
      }
      {!isOpen && (
        <div className={styles.hiddenFooter}>
          <div className={styles.footerOpen}>
            <button
              id={styles.openBtn}
              onClick={toggleMenu}>
              <Image src="/upArrow.svg" alt="Open arrow" width={20} height={20} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}