import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Search.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Random NFT Finder</title>
        <meta name="description" content="Find random NFT collections" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          🖼
          <br />
          Random NFT Finder
        </h1>
        <p className={styles.description}>
          What separates your Bored Apes from your Cool Cats?
          <br /> You are just a random adjective &amp; animal away from your
          next NFT cop, to the moon! 🚀
        </p>
        <Link href="/search">
          <a className={styles.button}>Search NFTs</a>
        </Link>
      </main>
    </div>
  )
}
