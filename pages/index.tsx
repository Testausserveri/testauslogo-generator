import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react'
import { TestausserveriLogo } from '../components/TestausserveriLogo';

export default function Home() {
  const [text, setText] = useState("");
  const router = useRouter();

  return (
    <div className="container">
      <Head>
        <title>Testauslogo generator</title>
        <meta name="description" content="Generate logos for projects related to Testausserveri" />
      </Head>
      <main>
        <div className="texts">
          <h1>Testauslogo Generator</h1>
          <p>Generate logos for Testausserveri projects</p>
        </div>
        <form onSubmit={() => {
          router.push(`/${text}`);
        }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
          />
          <button type="submit" className="generationButton">
            Generate
          </button>
        </form>
      </main>
      <a href="https://testausserveri.fi" style={{
        position: "absolute",
        left: 40,
        bottom: 20
      }}>
        <TestausserveriLogo />
      </a>
    </div >
  )
}