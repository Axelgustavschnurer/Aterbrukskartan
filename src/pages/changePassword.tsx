import React from "react";
import Head from "next/head";
import { cookies } from "next/headers"
import styles from '@/styles/newStory.module.css';
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { Data, getSessionData } from "@/session";

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target
  const formJSON = JSON.stringify({
    email: form.email.value,
    oldPassword: form.oldPassword.value,
    newPassword: form.newPassword.value,
  })

  // Try to login, redirect to the home page if successful.
  fetch('/api/changePassword', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      window.location.href = '/'
    } else {
      alert('Misslyckades med lösenordsbyte.')
    }
  }).catch((err) => {
    alert('Misslyckades med att skicka data.')
  })
}

export default function Login() {
  return (
    <>
      <Head>
        <title>Logga in</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      {/* Header */}
      <div className={styles.header} id={styles.header}>
        <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
      </div>

      {/* Form */}
      <div className={styles.addPostContainer}>
        <div className={styles.addNewPostContainer}>
          <h1 className={styles.addNewPostTitle}>Lösenordsbyte</h1>
          <div className={styles.addNewPostForm}>
            <form onSubmit={handleSubmit}>

              <div className={styles.addNewPostFormName}>
                <label htmlFor="email">
                  <h3>Email: </h3>
                </label>
                <input type="text" name="email" id="email" required={true} />
              </div>

              <div className={styles.addNewPostFormName}>
                <label htmlFor="oldPassword">
                  <h3>Gammalt lösenord: </h3>
                </label>
                <input type="password" name="oldPassword" id="oldPassword" required={true} />
              </div>

              <div className={styles.addNewPostFormName}>
                <label htmlFor="newPassword">
                  <h3>Nytt lösenord: </h3>
                </label>
                <input type="password" name="newPassword" id="newPassword" required={true} />
              </div>

              <br />
              <div className={styles.addNewPostFormSubmit}>
                <Button type="submit" id={styles.save}> Byt Lösenord </Button >
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