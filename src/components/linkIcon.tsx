import Image from "next/image";

export default function LinkIcon({
  src,
  alt,
  href,
}: {
  src: string,
  alt: string,
  href: string,
}) {
  return (
    <>
      <a href={href} style={{position: 'relative'}}>
        <Image src={src} alt={alt} width={35} height={35} />
      </a>
    </>
  )
}