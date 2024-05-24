import React from "react";
import Head from "next/head";
import { Data, getSessionData } from "@/session";
import Header from "@/components/header/header";

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
        <title>Byt lösenord</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      {/* Header */}
      <Header />

      {/* Form */}
      <main className="layout-main">
        <h1>Byt Lösenord</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" required={true} autoComplete="email" />

            <label htmlFor="oldPassword">Gammalt Lösenord</label>
            <input type="password" name="oldPassword" id="oldPassword" required={true} autoComplete="current-password" />

            <label htmlFor="newPassword">Nytt lösenord</label>
            <input type="password" name="newPassword" id="newPassword" required={true} autoComplete="new-password" />

            <input type="submit" id="save" value="Byt Lösenord" />
        </form>
      </main>
    </>
  )
}