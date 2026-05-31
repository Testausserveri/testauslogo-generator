import type { GetServerSideProps } from "next";
import Head from "next/head";
import { TestausserveriLogo } from "../components/TestausserveriLogo";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const rawText = Array.isArray(query.text) ? query.text[0] : query.text;
  const text = typeof rawText === "string" ? rawText.trim() : "";

  if (text) {
    return {
      redirect: {
        destination: `/${encodeURIComponent(text)}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export const config = {
  unstable_runtimeJS: false,
};

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Testauslogo generator</title>
        <meta
          name="description"
          content="Generate logos for Testausserveri projects"
        />
      </Head>
      <main>
        <div className="texts">
          <h1>Testauslogo Generator</h1>
          <p>Generate logos for Testausserveri projects</p>
        </div>
        <form action="/" method="get">
          <input name="text" placeholder="Enter text" />
          <button type="submit" className="generationButton">
            Generate
          </button>
        </form>
      </main>
      <a
        href="https://testausserveri.fi"
        style={{
          position: "absolute",
          left: 40,
          bottom: 20,
        }}
      >
        <TestausserveriLogo />
      </a>
    </div>
  );
}
