import { GetStaticProps } from "next"
import Link from "next/link"

export default function NotFound() {
  return (
    <>
      <Link href="/">Return to home</Link>
    </>
  )
}

export const getStaticProps: GetStaticProps = () => ({
  props: { title: "404 - Page Not Found" },
})
