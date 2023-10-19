import React from "react";
import Head from "next/head";
import { cookies } from "next/headers"
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
      <div>
        <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
      </div>

      {/* Form */}
      <div>
        <div>
          <h1>Lösenordsbyte</h1>
          <div>
            <form onSubmit={handleSubmit}>

              <div>
                <label htmlFor="email">
                  <h3>Email: </h3>
                </label>
                <input type="text" name="email" id="email" required={true} autoComplete="email" />
              </div>

              <div>
                <label htmlFor="oldPassword">
                  <h3>Gammalt lösenord: </h3>
                </label>
                <input type="password" name="oldPassword" id="oldPassword" required={true} autoComplete="current-password" />
              </div>

              <div>
                <label htmlFor="newPassword">
                  <h3>Nytt lösenord: </h3>
                </label>
                <input type="password" name="newPassword" id="newPassword" required={true} autoComplete="new-password" />
              </div>

              <br />
              <div>
                <Button type="submit" id="save"> Byt Lösenord </Button>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <div>
          <div>
            <div>STUNS</div>
            <div>
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