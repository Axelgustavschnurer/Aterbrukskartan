import React from "react";
import Head from "next/head";
import Image from "next/image";
import Modal from '@/components/redirectModal';

export default function Login() {
  const [modal, setModal] = React.useState(false);

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
        setModal(true);
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

        {/* Header */}
        <div style={{height: '50px', width: '100px', position: 'relative',}}>
          <Image src="/images/stuns_logo.png" alt="logo" fill style={{objectFit:"contain"}}
 />
        </div>
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

        {/* Footer */}
        <a href="https://stuns.se/" target="_blank" rel="noreferrer">
          STUNS
        </a>

        {/* Redirect modal, after login */}
        <Modal toggle={modal} />
      </div>
    </>
  )
}