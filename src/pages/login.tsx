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
    password: form.password.value,
  })

  // Try to login, redirect to the home page if successful.
  fetch('/api/login', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      window.location.href = '/'
    } else {
      alert('Login failed.')
    }
  }).catch((err) => {
    alert('Login failed.')
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
          <h1 className={styles.addNewPostTitle}>Inloggning</h1>
          <div className={styles.addNewPostForm}>
            <form onSubmit={handleSubmit}>

              <div className={styles.addNewPostFormName}>
                <label htmlFor="email">
                  <h3>Email: </h3>
                </label>
                <input type="text" name="email" required={true} autoComplete="email" />
              </div>

              <div className={styles.addNewPostFormName}>
                <label htmlFor="password">
                  <h3>Lösenord: </h3>
                </label>
                <input type="password" name="password" required={true} autoComplete="current-password" />
              </div>

              <br />
              <div className={styles.addNewPostFormSubmit}>
                <Button type="submit" id={styles.save}> Logga in </Button >
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