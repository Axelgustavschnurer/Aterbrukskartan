import { ReactNode } from "react";
import styles from "./aside.module.css";

// Conditionally renders a child element based on button press (do this without a useeffectif possible)
export default function Aside({ children }: { children: ReactNode }) {


  return (
    <>
        <aside className={styles.aside}>
            {children}
        </aside>
    </>
  )
}