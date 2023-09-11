import React from "react";
import Head from "next/head";
import styles from '@/styles/newStory.module.css';
import { Button } from "@nextui-org/react";
import Image from "next/image";
import prisma from "@/prismaClient";
import { InferGetServerSidePropsType } from "next";
import { OrgSelect, handleKeyDown } from "./addUser";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";

export async function getServerSideProps() {
  const organisations = await prisma.recycleOrganisation.findMany({
    select: {
      name: true,
    },
  })

  const users = await prisma.user.findMany({
    select: {
      email: true,
      isRecycler: true,
      isStoryteller: true,
      isAdmin: true,
      recycleOrganisations: {
        select: {
          name: true,
        },
      },
    },
  })

  return {
    props: {
      organisations: organisations.map((org) => org.name),
      users: users,
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
    isRecycler: form.isRecycler.checked,
    isStoryteller: form.isStoryteller.checked,
    isAdmin: form.isAdmin.checked,
    organisations: organisations,
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

export default function UpdateUser({ organisations, users }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [orgs, setOrgs] = React.useState<string[]>(organisations)
  const [currentOrgs, setCurrentOrgs] = React.useState<string[]>([])
  const [user, setUser] = React.useState<any>(null)
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

              <div className={styles.addNewPostFormSelect}>
                <label htmlFor="email">
                  <h3>Email: </h3>
                </label>
                <select
                  name="email"
                  id="email"
                  value={user?.email ?? ""}
                  onChange={(event) => {
                    const selectedUser = users.find((user) => user.email === event.target.value)
                    if (selectedUser) {
                      setUser(selectedUser)
                      setCurrentOrgs(selectedUser.recycleOrganisations.map((org) => org.name))
                    }
                  }}
                >
                  <option value="" disabled hidden>Välj användare</option>
                  {users?.map((user) => (
                    <option value={user.email} key={user.email}>{user.email}</option>
                  ))}
                </select>
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
                <input
                  type="checkbox"
                  name="isRecycler"
                  id="isRecycler"
                  style={{ width: "20px", height: "20px" }}
                  checked={user?.isRecycler ?? false}
                  onChange={(event) => {
                    setUser({ ...user, isRecycler: event.target.checked })
                  }}
                />
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="isStoryteller">
                  <h3>Ska användaren kunna skapa och redigera Stories? </h3>
                </label>
                <input
                  type="checkbox"
                  name="isStoryteller"
                  id="isStoryteller"
                  style={{ width: "20px", height: "20px" }}
                  checked={user?.isStoryteller ?? false}
                  onChange={(event) => {
                    setUser({ ...user, isStoryteller: event.target.checked })
                  }}
                />
              </div>

              <div style={{ marginTop: "10px" }}>
                <label htmlFor="isAdmin">
                  <h3>Ska användaren ha admin-privilegier? </h3>
                </label>
                <input
                  type="checkbox"
                  name="isAdmin"
                  id="isAdmin"
                  style={{ width: "20px", height: "20px" }}
                  checked={user?.isAdmin ?? false}
                  onChange={(event) => {
                    setUser({ ...user, isAdmin: event.target.checked })
                  }}
                />
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