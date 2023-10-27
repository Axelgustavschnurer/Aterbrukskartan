import React from "react";
import Head from "next/head";
import setFirstLetterCapital from "@/functions/setFirstLetterCapital";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import prisma from "@/prismaClient";
import LinkIcon from "@/components/buttons/backButton";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

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
    <div>
      {orgs.map((org) => (
        <div key={org} className="display-flex align-items-center gap-50 margin-y-50">
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
      <Header />

      <div className="layout-main">
        <main className="margin-y-100">
          <h1 className="display-flex align-items-center gap-50">         
            <LinkIcon src="/back.svg" alt="back" />
            Lägg till användare
          </h1>
          <form onSubmit={handleSubmit}>
            {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new organisations */}
            <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />

            <h2>Användarinfo</h2>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" required={true} autoComplete="off" />

            <label htmlFor="password">Lösenord</label>
            <input type="password" name="password" id="password" required={true} autoComplete="new-password" />

            <div className="display-flex align-items-center gap-50">
              <input type="checkbox" name="isRecycler" id="isRecycler" />
              <label htmlFor="isRecycler">Ska användaren kunna skapa och redigera inlägg på Återbrukskartan? </label>
            </div>

            <div className="display-flex align-items-center gap-50">
              <input type="checkbox" name="isStoryteller" id="isStoryteller" />
              <label htmlFor="isStoryteller">Ska användaren kunna skapa och redigera Stories?</label>
            </div>

            <div className="display-flex align-items-center gap-50">
              <input type="checkbox" name="isAdmin" id="isAdmin" />
              <label htmlFor="isAdmin"> Ska användaren ha admin-privilegier? </label>
            </div>

            <h2>Organisatiorisk tillhörighet</h2>
            <OrgSelect orgs={orgs} currentOrgs={currentOrgs} setCurrentOrgs={setCurrentOrgs} />
            <label htmlFor="organisation"> Ny organisation (Tryck enter om du vill lägga till mer än en organisation) </label>
            <input type="text" name="newOrganisation" id="newOrganisation" autoComplete="organization" onKeyDown={(event) => handleKeyDown(event, orgs, setOrgs, currentOrgs, setCurrentOrgs)} />
            <input type="submit" id="save" value="Skapa Användare" />
          </form>
        </main>
      </div>

      {/* Footer */}
      <Footer />

    </>
  )
}