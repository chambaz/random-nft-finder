import { useState, useEffect } from 'react'
import Head from 'next/head'
import { FiRefreshCcw } from 'react-icons/fi'
import confetti from 'canvas-confetti'
import styles from '../styles/Search.module.css'

export default function Home() {
  const [name, setName] = useState('')
  const [foundNft, setFoundNft] = useState(null)
  const [stateLabel, setStateLabel] = useState('Searching NFTs')
  const [documentTitle, setDocumentTitle] = useState('Random NFT Finder')

  const searchLoop = async () => {
    setStateLabel('Searching for NFTs')
    setDocumentTitle('Searching Random NFTs...')
    const nfts = await searchNFTs()
    setName(nfts.name)

    if (!nfts.nft.length) {
      searchLoop()
    } else {
      const nft = nfts.nft[0]
      const meta = JSON.parse(nft.metadata)
      let nftData

      nft.meta = meta
      nft.openSeaLink = `https://opensea.io/assets/${nft.token_address}/${nft.token_id}`

      if (
        nft.token_address === '0xc7e5e9434f4a71e6db978bd65b4d61d3593e5f27' ||
        nft.token_address === '0x06012c8cf97bead5deae237070f9587f8e7a266d' ||
        nft.token_address === '0x1d963688fe2209a98db35c67a041524822cf04ff' ||
        nft.token_address === '0x03f5cee0d698c24a42a396ec6bdaee014057d4c8' ||
        nft.token_address === '0x7d256d82b32d8003d1ca1a1526ed211e6e0da9e2' ||
        (!meta.image && !meta.image_url)
      ) {
        searchLoop()
      } else {
        let img = meta.image || meta.image_url

        if (img.substr(0, 7) === 'ipfs://') {
          const imgParts = img.split('ipfs://')

          if (imgParts[1].indexOf('ipfs/') > -1) {
            imgParts[1] = imgParts[1].substr(5, imgParts[1].length)
          }

          img = `https://cloudflare-ipfs.com/ipfs/${imgParts[1]}`
        }

        nftData = Object.assign({}, nft)
        nftData.image = img
        setFoundNft(nftData)
        setStateLabel('')
        setDocumentTitle('Random NFT Finder')
        confetti()
      }
    }
  }

  const searchNFTs = async () => {
    const nameReq = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/name`)
    const nameJson = await nameReq.json()

    return nameJson
  }

  const refresh = () => {
    setName('')
    setFoundNft(null)
    searchLoop()
  }

  useEffect(() => {
    searchLoop()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>{documentTitle}</title>
        <meta name="description" content="Find random NFT collections..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          🖼
          <br />
          Random NFT Finder
        </h1>
        {stateLabel && <p>{stateLabel}...</p>}
        {!foundNft && <p className={styles.name}>{name}</p>}
        {foundNft && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{foundNft.meta.name}</h2>
            {foundNft.image && (
              <img
                src={foundNft.image}
                alt={foundNft.meta.name}
                className={styles.cardImg}
              />
            )}
            {/* <p className={styles.cardDesc}>{foundNft.meta.description}</p> */}
            <a
              href={foundNft.openSeaLink}
              className={styles.cardLink}
              target="_blank"
              rel="noreferrer">
              {foundNft.openSeaLink}
            </a>
          </div>
        )}
        {foundNft && !stateLabel && (
          <button onClick={refresh} className={styles.button}>
            <FiRefreshCcw className={styles.buttonIcon} />
            Search again
          </button>
        )}
      </main>
    </div>
  )
}
