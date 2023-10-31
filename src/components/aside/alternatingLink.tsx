import React from 'react';
import styles from './aside.module.css'; // Make sure to import your styles module
import Link from 'next/link';

export default function AlternatingLink({ currentMap }: { currentMap: string }) {
  if (currentMap === "Stories") {
    return (
      <Link href="/aterbruk" className={styles.alternatingLink}>
        Till Återbruk ⟶
      </Link>
    );
  } else if (currentMap === "Recycle") {
    return ( // Add the missing return statement here
      <Link href="/stories" className={styles.alternatingLink}>
        Till Stories ⟶
      </Link>
    );
  }

  return null; // Add a default return statement if needed
}
