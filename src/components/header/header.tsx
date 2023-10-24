import Image from "next/image"
import Link from "next/link"


export default function Header() {
  return (
    <>
      <header className="padding-y-100">
        <div className="layout-main">
          <Link href="https://stuns.se/en/">
            <Image src="/images/stuns_logo.png" alt="logo" width={110} height={30} />
          </Link>
        </div>
      </header>
    </>
  )

}