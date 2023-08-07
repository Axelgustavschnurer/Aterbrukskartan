import React from "react";
import Head from "next/head";
import styles from '@/styles/newStory.module.css';
import { Button } from "@nextui-org/react";
import Image from "next/image";

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target
  const formJSON = JSON.stringify({
    email: form.email.value,
    isRecycler: form.isRecycler.checked,
    isStoryteller: form.isStoryteller.checked,
    isAdmin: form.isAdmin.checked,
    // This should be updated if we want to add multiple organisations to a user.
    organisations: form.organisation.value ? [form.organisation.value] : [],
  })

  // Try to update user, alert if successful or not.
  fetch('/api/editUser', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      alert('Användare uppdaterad.')
    } else {
      alert('Misslyckades att uppdatera användare.')
    }
  }).catch((err) => {
    alert('Misslyckades att skicka data.')
  })
}

export default function UpdateUser() {
  // TODO: Get user data from database and do something like editPost.tsx and editStory.tsx to autofill the form.
  return (
    <>
      <Head>
        <title>Uppdatera användare</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      {/* Header */}
      <div className={styles.header} id={styles.header}>
        <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
      </div>

      {/* Form */}
      <div className={styles.addPostContainer}>
        <div className={styles.addNewPostContainer}>
          <h1 className={styles.addNewPostTitle}>Uppdatera användare</h1>
          <p>Man måste tyvärr fylla i datan manuellt i nuläget, förhoppningsvis kan det fyllas i automatiskt framöver</p>
          <div className={styles.addNewPostForm}>
            <form onSubmit={handleSubmit}>

              <div className={styles.addNewPostFormName}>
                <label htmlFor="email">
                  <h3>Email: </h3>
                </label>
                <input type="text" name="email" id="email" required={true} autoComplete="off"/>
              </div>

              {/* Currently a dropdown + freetext if choosing new org.,
              but should probably be checkboxes + freetext instead, to allow multiple orgs for one user */}
              {/* TODO: Make dropdown similar to org selector in /aterbruk/newpost */}
              <div className={styles.addNewPostFormName}>
                <label htmlFor="organisation">
                  <h3>Ny organisation: </h3>
                </label>
                <input type="text" name="organisation" id="organisation" autoComplete="organization" />
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="isRecycler">
                  <h3>Ska användaren kunna skapa och redigera inlägg på Återbrukskartan? </h3>
                </label>
                <input type="checkbox" name="isRecycler" id="isRecycler" style={{ width: "20px", height: "20px" }} />
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="isStoryteller">
                  <h3>Ska användaren kunna skapa och redigera Stories? </h3>
                </label>
                <input type="checkbox" name="isStoryteller" id="isStoryteller" style={{ width: "20px", height: "20px" }} />
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="isAdmin">
                  <h3>Ska användaren ha admin-privilegier? </h3>
                </label>
                <input type="checkbox" name="isAdmin" id="isAdmin" style={{ width: "20px", height: "20px" }} />
              </div>

              <br />
              <div className={styles.addNewPostFormSubmit}>
                <Button type="submit" id={styles.save}>Uppdatera</Button >
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer} id={styles.footer}>
        < div className={styles.footerContainer}>
          <div className={styles.footerRow}>
            <div className={styles.footerHeader}>STUNS</div>
            <div className={styles.footerLink}>
              <a href="https://stuns.se/" target="_blank" rel="noreferrer">
                STUNS
              </a>
            </div >
          </div >
        </div >
      </div >
    </>
  )
}