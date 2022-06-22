import Head from 'next/head'
import Link from 'next/link';
import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState("");

  return (
    <div className="container">
      <Head>
        <title>Testauslogo generator</title>
        <meta name="description" content="Generate logos for projects related to Testausserveri" />
      </Head>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
      />
      <Link href={`/${text}`}>
        Generate
      </Link>
    </div >
  )
}