import React from "react";
import Head from "next/head";
import styles from '@/styles/newStory.module.css';
import { Button } from "@nextui-org/react";
import Image from "next/image";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import prisma from "@/prismaClient";

export async function getServerSideProps() {
  const organisations = await prisma.recycleOrganisation.findMany({
    select: {
      name: true,
    },
  })

  return {
    props: {
      organisations: organisations.map((org) => org.name),
    },
  }
}

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target.elements
  let organisations = []
  for (let i = 0; i < form.organisation.length; i++) {
    if (form.organisation[i].checked) {
      organisations.push(form.organisation[i].value)
    }
  }

  if (form.newOrganisation.value !== '') {
    organisations.push(setFirstLetterCapital(form.newOrganisation.value))
  }

  const formJSON = JSON.stringify({
    email: form.email.value,
    password: form.password.value,
    isRecycler: form.isRecycler.checked,
    isStoryteller: form.isStoryteller.checked,
    isAdmin: form.isAdmin.checked,
    organisations: organisations,
  })

  // Try to create user, alert if successful or not.
  fetch('/api/createUser', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      alert('Ny användare skapad.')
    } else {
      alert('Misslyckades att skapa användare.')
    }
  }).catch((err) => {
    alert('Misslyckades att skicka data.')
  })
}

export function OrgSelect({ orgs, currentOrgs, setCurrentOrgs }: { orgs: string[], currentOrgs: string[], setCurrentOrgs: Function }) {
  return (
    <div className={styles.optionList}>
      {/* Sorry for the inline styling; I'm not a frontend dev, so I'm just modifying the existing styles. */}
      <div className={styles.form} style={{ height: 'auto', margin: '5px auto' }}>
        {orgs.map((org) => (
          <div className={styles.inputGroup} key={org}>
            <input
              type="checkbox"
              id={org}
              name='organisation'
              value={org}
              checked={currentOrgs.includes(org)}
              onChange={(event) => {
                if (event.target.checked) {
                  setCurrentOrgs([...currentOrgs, org])
                }
                else {
                  setCurrentOrgs(currentOrgs.filter((currentOrg) => currentOrg !== org))
                }
              }}
            />
            <label htmlFor={org}>{org}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>, orgs: string[], newOrgs: Function, currentOrgs: string[], setCurrentOrgs: Function) {
  if (event.key === 'Enter') {
    const newOrg = setFirstLetterCapital(event.currentTarget.value)
    if (orgs.includes(newOrg)) {
      alert('Organisationen finns redan.')
    } else {
      newOrgs([...orgs, newOrg])
      setCurrentOrgs([...currentOrgs, newOrg])
    }
    event.currentTarget.value = ''
  }
}

export default function Signup({ organisations }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let [orgs, setOrgs] = React.useState<string[]>(organisations)
  let [currentOrgs, setCurrentOrgs] = React.useState<string[]>([])
  return (
    <>
      <Head>
        <title>Lägg till användare</title>
        <link rel="icon" type="image/x-icon" href="/stunsicon.ico" />
      </Head>

      {/* Header */}
      <div className={styles.header} id={styles.header}>
        <Image src="/images/stuns_logo.png" alt="logo" width={170} height={50} />
      </div>

      {/* Form */}
      <div className={styles.addPostContainer}>
        <div className={styles.addNewPostContainer}>
          <h1 className={styles.addNewPostTitle}>Lägg till användare</h1>
          <div className={styles.addNewPostForm}>
            <form onSubmit={handleSubmit}>
              {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new organisations */}
              <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />

              <div className={styles.addNewPostFormName}>
                <label htmlFor="email">
                  <h3>Email: </h3>
                </label>
                <input type="text" name="email" id="email" required={true} autoComplete="off" />
              </div>

              <div className={styles.addNewPostFormName}>
                <label htmlFor="password">
                  <h3>Lösenord: </h3>
                </label>
                <input type="password" name="password" id="password" required={true} autoComplete="new-password" />
              </div>

              <div className={styles.addNewPostFormName}>
                <h3>Organisation: </h3>
                <OrgSelect orgs={orgs} currentOrgs={currentOrgs} setCurrentOrgs={setCurrentOrgs} />
                <label htmlFor="organisation"> <h3> Ny organisation: </h3> (Tryck enter om du vill lägga till mer än en organisation) </label>
                <input type="text" name="newOrganisation" id="newOrganisation" autoComplete="organization" onKeyDown={(event) => handleKeyDown(event, orgs, setOrgs, currentOrgs, setCurrentOrgs)} />
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
                <Button type="submit" id={styles.save}>Skapa användare</Button >
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