import Image from "next/image";
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
      <button onClick={() => router.back()} style={{position: 'relative', display: 'grid', cursor: 'pointer', backgroundColor: 'unset', border: 'unset'}}>
        <Image src={src} alt={alt} width={35} height={35} />
      </button>
    </>
  )
}