import Image from "next/image";
import styles from './buttons.module.css'
import { useRouter } from 'next/router'


export default function LinkIcon({
  src,
  alt,
}: {
  src: string,
  alt: string,
}) {
  const router = useRouter()
  return (
    <>
      <button type="button" onClick={() => router.back()} className={styles.backButton}>
        <Image src={src} alt={alt} width={35} height={35} />
      </button>
    </>
  )
}