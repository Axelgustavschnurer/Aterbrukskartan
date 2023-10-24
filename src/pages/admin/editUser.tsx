import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/prismaClient";
import { InferGetServerSidePropsType } from "next";
import { OrgSelect, handleKeyDown } from "./addUser";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";
import LinkIcon from "@/components/linkIcon";
import Header from "@/components/header/header";

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
      <Header />

      <div className="layout-main">
        {/* Form */}
        <main>
          <h1 className="display-flex align-items-center gap-50">         
            <LinkIcon src="/back.svg" alt="back" />
            Uppdatera användare
          </h1>
          <form onSubmit={handleSubmit}>
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

            <div className="display-flex align-items-center gap-50">
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
              <label htmlFor="isRecycler">Ska användaren kunna skapa och redigera inlägg på Återbrukskartan? </label>
            </div>

            <div className="display-flex align-items-center gap-50">
              <input
                type="checkbox"
                name="isStoryteller"
                id="isStoryteller"
                checked={user?.isStoryteller ?? false}
                onChange={(event) => {
                  setUser({ ...user, isStoryteller: event.target.checked })
                }}
              />
              <label htmlFor="isStoryteller">Ska användaren kunna skapa och redigera Stories? </label>
            </div>

            <div className="display-flex align-items-center gap-50">
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
              <label htmlFor="isAdmin">Ska användaren ha admin-privilegier?</label>
            </div>

            <h2>Organisation</h2>
            <OrgSelect orgs={orgs} currentOrgs={currentOrgs} setCurrentOrgs={setCurrentOrgs} />
            <label htmlFor="organisation"> Ny organisation (Tryck enter om du vill lägga till mer än en organisation) </label>
            <input type="text" name="newOrganisation" id="newOrganisation" autoComplete="organization" onKeyDown={(event) => handleKeyDown(event, orgs, setOrgs, currentOrgs, setCurrentOrgs)} />

            <input type="submit" id='save' value="Uppdatera" />

          </form>
        </main>

        {/* Footer */}

        <a href="https://stuns.se/" target="_blank" rel="noreferrer">
          STUNS
        </a>
      </div>
    </>
  )
}