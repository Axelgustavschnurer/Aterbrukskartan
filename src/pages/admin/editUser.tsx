import React from "react";
import Head from "next/head";
import prisma from "@/prismaClient";
import { InferGetServerSidePropsType } from "next";
import { OrgSelect, handleKeyDown } from "./addUser";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";
import LinkIcon from "@/components/buttons/backButton";

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
        <link rel="icon" type="image/x-icon" href="/favicon.svg" />
      </Head>

      <div className="container-text" style={{ marginInline: 'auto' }}>
        {/* Form */}
        <main className="margin-block-100">
          <h1 className="display-flex align-items-center gap-50">
            <LinkIcon src="/back.svg" alt="back" />
            Uppdatera användare
          </h1>
          <form onSubmit={handleSubmit}>
            <fieldset className="margin-block-100">
              <legend>Användarinfo</legend>
              <label className="block margin-block-75">
                Användare
                <select
                  className="margin-block-25"
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
              </label>
              
              <label className="display-flex align-items-center gap-50">
                <input
                  type="checkbox"
                  name="isRecycler"
                  id="isRecycler"
                  checked={user?.isRecycler ?? false}
                  onChange={(event) => {
                    setUser({ ...user, isRecycler: event.target.checked })
                  }}
                />
                Ska användaren kunna skapa och redigera inlägg på Återbrukskartan?
              </label>

              <label className="display-flex align-items-center gap-50">
                <input
                  type="checkbox"
                  name="isAdmin"
                  id="isAdmin"
                  checked={user?.isAdmin ?? false}
                  onChange={(event) => {
                    setUser({ ...user, isAdmin: event.target.checked })
                  }}
                />
                Ska användaren ha admin-privilegier?
              </label>
            </fieldset>
          
            <fieldset className="margin-block-100">
              <legend>Organisation</legend>
              <OrgSelect orgs={orgs} currentOrgs={currentOrgs} setCurrentOrgs={setCurrentOrgs} />

              <label className="block margin-block-75">
                Ny organisation (Tryck enter om du vill lägga till mer än en organisation)
                <input className="margin-block-25" type="text" name="newOrganisation" id="newOrganisation" autoComplete="organization" onKeyDown={(event) => handleKeyDown(event, orgs, setOrgs, currentOrgs, setCurrentOrgs)} />
              </label>
            </fieldset>

            <input type="submit" id='save' value="Uppdatera" />

          </form>
        </main>
      </div>
    </>
  )
}