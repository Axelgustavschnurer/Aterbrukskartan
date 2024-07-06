import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import router from 'next/router'

export default function App({ Component, pageProps }: AppProps) {

  const [isNavClosed, setIsNavClosed] = useState(false)

  // Check session storage for the nav state
  useEffect(() => {
    if (sessionStorage?.getItem('navClosed') == 'true') {
      setIsNavClosed(true)
    }
  }, [])

  router.events.on('routeChangeComplete', () => {
    const indicator = document.getElementById('navigation-indicator')
    if (indicator) {
      switch(router.pathname) {
        case '/aterbruk': 
          indicator.style.transform = 'translate(-100%, 50%)'
          break;
        case '/aterbruk/newPost': 
          indicator.style.transform = 'translate(-100%, 250%)'
          break;
        case '/aterbruk/editPost': 
          indicator.style.transform = 'translate(-100%, 450%)'
          break;
        case '/admin/addUser': 
          indicator.style.transform = 'translate(-100%, 650%)'
          break;
        case '/admin/editUser': 
          indicator.style.transform = 'translate(-100%, 850%)'
          break;
      }
    }
  })


  return (
    <div className='display-flex gap-50 padding-50' style={{ backgroundColor: '#f5f5f5' }}>
      <aside>
        <nav className='padding-50 flex' style={{backgroundColor: 'white', borderRadius: '.5rem', flexDirection: 'column', overflow: 'hidden', height: 'calc(100dvh - 1rem)', position: 'sticky', top: '.5rem'}}>
          <section>
            <div className='padding-50' style={{ position: 'relative', width: 'fit-content' }}>
              <input type="checkbox" id='toggle-nav' style={{ position: 'absolute', left: '0', top: '0', height: '100%', width: '100%', zIndex: '2', opacity: '0' }} checked={isNavClosed}
                onChange={() => {
                  // If the nav is currently open, remove the item from session storage, otherwise add it
                  if (isNavClosed) {
                    sessionStorage?.removeItem('navClosed')
                  } else {
                    sessionStorage?.setItem('navClosed', 'true')
                  };
                  setIsNavClosed(!isNavClosed);
                }}
              />
              <Image src='/hamburger.svg' alt='Växla navigering' width={24} height={24} style={{ display: 'grid' }} />
            </div>

            {/* Login button  */}
            <Link href="/login" className='flex align-items-center gap-100 padding-50 navbar-link margin-block-100'>
              <Image src="/images/adminIcons/login.svg" alt='Logga in' width={24} height={24} />
              Logga in
            </Link>
          </section>

          <section className='flex-grow-100 margin-block-100' id='navigation' style={{position: 'relative'}}>
            <div id='navigation-indicator' style={{position: 'absolute', left: '0', top: '0', backgroundColor: '#fd9800', width: '2px', height: '20px', transform: 'translate(calc(-100% - 1px), 50%)', transition: 'transform .2s ease'}}></div>
            {/* Buttons leading to other pages where one can add/edit projects to the database */}
            <>
              <Link href='/aterbruk' className='flex align-items-center gap-100 padding-50 navbar-link'>
                <Image src="/home.svg" alt='Lägg till nytt projekt' width={24} height={24} />
                Hem
              </Link>

              <Link href='/aterbruk/newPost' className='flex align-items-center gap-100 padding-50 navbar-link'>
                <Image src="/images/adminIcons/addToMap.svg" alt='Lägg till nytt projekt' width={24} height={24} />
                Skapa nytt inlägg
              </Link>

              <Link href='/aterbruk/editPost' className='flex align-items-center gap-100 padding-50 navbar-link'>
                <Image src="/images/adminIcons/edit.svg" alt='Redigera projekt' width={24} height={24} />
                Redigera inlägg
              </Link>
            </>

            {/* Buttons leading to the admin pages */}
            <>
              <Link href='/admin/addUser' className='flex align-items-center gap-100 padding-50 navbar-link'>
                <Image src="/images/adminIcons/addUser.svg" alt='Lägg till ny användare' width={24} height={24} />
                Skapa ny användare
              </Link>

              <Link href='/admin/editUser' className='flex align-items-center gap-100 padding-50 navbar-link' >
                <Image src="/images/adminIcons/editUser.svg" alt='Redigera användare' width={24} height={24} />
                Redigera användare
              </Link>
            </>
          </section>

          <section>
            <Link href='https://github.com/STUNS-Uppsala/Aterbrukskartan' target='_blank' className='flex align-items-center gap-100 padding-50 navbar-link'>
              <Image src="/github-mark.svg" alt='GitHub logo' width={24} height={24} />
              Se koden på GitHub
            </Link>

            {/* Logout button */}
            <button type="button" className='flex align-items-center padding-50 gap-100' style={{ width: '100%', fontSize: '1rem', fontWeight: '500', backgroundColor: 'transparent' }}>
              <Image src="/images/adminIcons/logout.svg" alt='Logga ut' width={24} height={24} />
              Logga ut
            </button>
          </section>
        </nav>
      </aside>
      <Component {...pageProps} />
    </div>
  )
}
