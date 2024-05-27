import React from "react";
import Head from "next/head";

export default function Login() {

  function handleSubmit(event: any) {
    event.preventDefault()

    const form = event.target
    const formJSON = JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    })

    // Try to login, redirect to the åtebrukspage
    fetch('/api/login', {
      method: 'POST',
      body: formJSON,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        document.location.href = '/aterbruk'; // TODO: Let user press link if this fails
      } else {
        alert('Login failed.')
      }
    }).catch((err) => {
      alert('Login failed.')
    })
  }

  return (
    <>
      <Head>
        <title>Logga In</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      <div className="layout-main">

        {/* Form */}

        <main className="card">
          <h1>Logga In</h1>
          <form onSubmit={handleSubmit} >

            <label htmlFor="email">Email</label>
            <input type="text" placeholder="email" name="email" id="email" required={true} autoComplete="email" />
            <label htmlFor="password">Lösenord</label>
            <input type="password" placeholder="lösenord" name="password" id="password" required={true} autoComplete="current-password" />
            <input type="submit" id="save" value="Logga In" className="cta" />
            
          </form>
        </main>
 
      </div>

    </>
  )
}